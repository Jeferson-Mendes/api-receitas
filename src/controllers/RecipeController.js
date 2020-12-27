
const Recipe = require('../models/Recipe');

module.exports = {
    async index(req, res) {
        try {

            const recipes = await Recipe.find({});
            return res.send({ recipes })

        }catch(err) {
            return res.status(400).send({ error: 'Fail to get recipe list.' })
        }
    },

    async create(req, res) {
        const userId = req.userId;
        const username = req.username;
        
        try {
            const data = {
                ...req.body,
                authorId: userId,
                authorName: username
            }
        
            const recipe = await Recipe.create(data)
            return res.send(recipe)
        }catch(err){
            return res.status(400).send({ error: 'Fail to create recipe'})
        }
    },

    async update(req, res) {
        const userId = req.userId
        const recipeId = req.headers.recipeid;
        const recipe = await Recipe.findById({_id: recipeId}, (err)=> {
            if(err) {
                return res.status(400).send({error: 'Recipe not found'})
            }
        })

        if(recipe.authorId !== userId){
            return res.status(400).send({error: 'You cant update this recipe'})
        }

        await Recipe.findByIdAndUpdate({_id: recipeId}, req.body, (err) => {
            if(err) {
                return res.status(400).send({error: 'Fail to update recipe', err})
            }

            return res.send({success: 'Recipe has been deleted'})
        })
    },

    async delete(req, res) {
        const userId = req.userId
        const recipeId = req.params.recipe;
        const recipe = await Recipe.findById({_id: recipeId}, (err)=> {
            if(err) {
                return res.status(400).send({error: 'Recipe not found'})
            }
        })

        if(recipe.authorId !== userId){
            return res.status(400).send({error: 'You cant delete this recipe'})
        }

        await Recipe.deleteOne({_id: recipeId}, (err) => {
            if(err) {
                return res.status(400).send({error: 'Fail to delete', err})
            }

            return res.send({success: 'Recipe has been deleted'})
        })
    }

}