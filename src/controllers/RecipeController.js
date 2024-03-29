
const cloudinary = require('../config/cloudnary');
const Recipe = require('../models/Recipe');
const Resource = require('../models/Resource');
const mongoose = require('mongoose')
const { characterRemove } = require('../utils/index');
module.exports = {
    async index(req, res) {
        const limit = parseInt(String(req.query.limit)) || 10;
        const page = parseInt(String(req.query.page)) || 1;
        const skip = limit * (page - 1); 

        try {
            const recipes = await Recipe.find({}).populate('author').populate('resource').limit(limit).skip(skip);
            const TotalRecipes = await Recipe.find({}).countDocuments();

            const totalPages = Math.ceil(TotalRecipes / limit);
            return res.send({ recipes, limit, page, totalPages })

        }catch(err) {
            return res.status(400).send({ error: 'Fail to get recipe list.' })
        }
    },

    async detail(req, res) {
        const { recipeId } = req.params;

        try {
            const recipe = await Recipe.findOne({ _id: recipeId }).populate({ path: 'author', populate: { path: 'resource' } }).populate('resource').populate('category');

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' })
            }

            return res.json({ recipe });
        } catch (error) {
            console.log(error);
            return res.status(400).send({error: 'Internal server error'});
        }
    },

    async search(req,res) {
        const searchTerm = req.query.search_query
        const formatedQuery = characterRemove(null, searchTerm)

        try {

            const recipes = await Recipe.find(
                { $or: [{ key_words: {$regex: formatedQuery} }, { title: {$regex: formatedQuery} }, { description: {$regex: formatedQuery} }] }).populate('resource').populate('author')

            return res.send({recipes})

        }catch(err){
            return res.status(400).send({error: 'Fail to search recipe'})
        }
    },

    async getByCategory(req,res) {
        const { categories } = req.query;
        const categoriesArray = String(categories).split(',');

        try {
            const recipes = await Recipe.find({ category: { $in: categoriesArray } });

            return res.json({ recipes, status: 200 });
        } catch (error) {
            console.log(error)
            return res.status(400).send({error: 'Internal Server Error'})
        }
    },

    async create(req, res) {
        const userId = req.userId;
        const file = req.file;
        
        try {
            
            if (file) {
                // create resource

                const uploadResult = await cloudinary.uploader.upload(file.path, (error) => {
                    if(error) {
                        return res.status(400).send({ error: 'Fail to upload image' });
                    }
                })

                const resource = await Resource.create({
                    cloudinary_id: uploadResult.public_id,
                    secure_url: uploadResult.secure_url
                })

                const data = {
                    ...req.body,
                    author: userId,
                    category: req.body.category_id,
                    resource: resource._id
                }
            
                const recipe = await Recipe.create(data)
                return res.send(recipe)
            }

            const data = {
                ...req.body,
                category: req.body.category_id,
                author: userId,
            }
        
            const recipe = await Recipe.create(data)
            return res.send(recipe)
        }catch(err){
            console.log(err)
            return res.status(400).send({ error: 'Fail to create recipe'})
        }
    },

    async update(req, res) {
        const userId = req.userId
        const recipeId = req.params.recipeId;
        const file = req.file;
        const recipe = await Recipe.findById({_id: recipeId}, (err)=> {
            if(err) {
                return res.status(400).send({error: 'Recipe not found'})
            }
        })

        if(String(recipe.author) !== String(userId)){
            return res.status(400).send({error: 'You cant update this recipe'})
        }

        try {

            if (file) {
                if(recipe.resource) {
                    // delete resource
                    await cloudinary.uploader.destroy(recipe.resource.cloudinary_id);
                    // upload new image to cloudinary
                    const uploadResult = await cloudinary.uploader.upload(file.path);
                    // update your resource document
                    await Resource.updateOne(
                        { _id: recipe.resource._id },
                        { cloudinary_id: uploadResult.public_id, secure_url: uploadResult.secure_url  });
                } else {
                    // create resource
                    const uploadResult = await cloudinary.uploader.upload(file.path, (error) => {
                        if(error) {
                            return res.status(400).send({ error: 'Fail to upload image' });
                        }
                    })
                    var resource = await Resource.create({
                        cloudinary_id: uploadResult.public_id,
                        secure_url: uploadResult.secure_url
                    })
                }
            }
    
            await Recipe.findByIdAndUpdate({_id: recipeId}, {...req.body, resource: resource._id});
    
            return res.send({success: 'Recipe has been updated'})
            
        } catch (error) {
            console.log(error);
            return res.status(401).send({ error: 'Internal server error' })
        }

    },

    async delete(req, res) {
        const userId = req.userId
        const recipeId = req.params.recipe;
        const recipe = await Recipe.findById({_id: recipeId}, (err)=> {
            if(err) {
                return res.status(400).send({error: 'Recipe not found'})
            }
        }).populate('resource');

        if(String(recipe.author) !== String(userId)){
            return res.status(400).send({error: 'You cant delete this recipe'})
        }

        if (recipe.resource) {
            // delete resource
            await cloudinary.uploader.destroy(recipe.resource.cloudinary_id);
            await Resource.deleteOne({ _id: recipe.resource._id });
        }

        await Recipe.deleteOne({_id: recipeId}, (err) => {
            if(err) {
                return res.status(400).send({error: 'Fail to delete', err})
            }

            return res.send({success: 'Recipe has been deleted'})
        })
    }

}