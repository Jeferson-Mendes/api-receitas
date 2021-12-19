
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Resource = require('../models/Resource');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const cloudinary = require('../config/cloudnary');
const { update } = require('../models/User');

function generateToken( params = {}){
    return jwt.sign( params, authConfig.secret, { // Configurando o nosso token
        expiresIn: 86400 // Expira em 1 dia
    } )
}

module.exports = {

    async index(req, res) {
        const limit = parseInt(String(req.query.limit)) || 10;
        const page = parseInt(String(req.query.page)) || 1;
        const skip = limit * (page - 1);

        try{
            const users = await User.find({}).limit(limit).skip(skip);
            const TotalUsers = await User.find({}).countDocuments();

            const totalPages = Math.ceil(TotalUsers / limit);

            return res.send({ users, limit, page, totalPages });
        }catch(err){
            return res.status(400).send({error: 'Fail to get users'})
        }
    },

    async detail(req, res) { // Get user detail
        const userId = req.params.id;

        try {
            const user = await User.findOne({ _id: userId }).populate('resource');

            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
        
            return res.json({ user })
        }catch(err){
            console.log(err);
            return res.status(400).send({error: 'Internal server error'})
        }

    },

    async create(req, res){
        const { name, email, password } = req.body;
        const file = req.file;

        try {
            if( await User.findOne({ email })){
                return res.status(400).send({error: 'User already exists.'})
            }

            if (file) {
                // create resource

                const uploadResult = await cloudinary.uploader.upload(file.path, (error, result) => {
                    if(error) {
                        return res.status(400).send({ error: 'Fail to upload image' })
                    }
                })

                const resource = await Resource.create({
                    cloudinary_id: uploadResult.public_id,
                    secure_url: uploadResult.secure_url
                })

                const userData = {
                    name,
                    email,
                    password,
                    resource: resource._id,
                }
    
                const user = await User.create(userData);
                
                user.password = undefined; // Para não vir a senha no select
    
                return res.send({ 
                    user,
                    token: generateToken({id: user.id, username: user.name})
                })
            }

            const user = await User.create(req.body);
                
                user.password = undefined; // Para não vir a senha no select
    
                return res.send({ 
                    user,
                    token: generateToken({id: user.id, username: user.name})
                })

        }catch(err) {
            console.log(err)
            return res.status(400).send({ error: 'Registration failed' })
        }
    },

    async authenticate(req, res) {

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password').populate('resource'); // Encontra um email igual ao do req.body, e busca a senha tbm

        if(!user) {
            return res.status(400).send({error: 'User not found'})
        }

        if(! await bcrypt.compare(password, user.password)){
            return res.status(400).send({error: 'Invalid password'})
        }

        user.password = undefined

        return res.send({ 
            user, 
            token: generateToken({id: user.id, username: user.name})
        })
    },

    async updateResourse(req, res) {
        const userId = req.userId;
        const filePath = req.file;

        try {
            if (!filePath) {
                return res.status(400).send({ error: 'Field image is required' });
            }
    
            const user = await User.findById(userId).populate('resource');
    
            if (!user) {
                return res.status(404).send({ error: 'User not found' })
            }
            
            // delete image from cloudinary
            await cloudinary.uploader.destroy(user.resource.cloudinary_id)

            // upload new image to cloudinary
            const uploadResult = await cloudinary.uploader.upload(filePath.path);

            // update resource document
            await Resource.updateOne(
                { _id: user.resource._id },
                { cloudinary_id: uploadResult.public_id, secure_url: uploadResult.secure_url  })

            return res.json({ user, status: 200 });
        } catch (error) {
            return res.status(401).send({error: 'Internal server error'})            
        }
    },

    async update(req, res) {
        const { name, email } = req.body;
        const { userId } = req.params;
        const userAuthenticatedId = req.userId;

        if (userAuthenticatedId !== userId) {
            return res.status(400).send({error: 'Você não tem permissão para acessar esse recurso'})
        }

        const UserEmailExists = await User.findOne({ email });

        if (UserEmailExists && UserEmailExists.id !== userAuthenticatedId) {
            return res.status(400).send({error: 'Email já está sendo utilizado'})
        }

        try {
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não existe' });
            }

            await User.updateOne({ _id: userId }, { name, email }, function(error){
                if(error) {
                    return res.status(400).json({ error: 'Falha ao atualizar usuário' });
                }
            });

            return res.json({ user, status: 200 });
        } catch (error) {
            return res.status(401).send({error: 'Internal server error'});
        }
    },

    async updatePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId; 

        try {
            const user = await User.findOne({ _id: userId }).select('+password');

            if (!user) {
                return res.status(404).json({ error: 'Usuário não existe' })
            }

            const passwordEquals = await bcrypt.compare(currentPassword, user.password);

            if (!passwordEquals) {
                return res.status(401).json({ error: 'Senha atual incorreta' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.updateOne({ _id: userId }, { password: hashedPassword });

            user.password = undefined;
            
            return res.json({ user, status: 200 });            
        } catch (error) {
            console.log(error)
            return res.status(401).send({error: 'Internal server error'})
        }
    }
}