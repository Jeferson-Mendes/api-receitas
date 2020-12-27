
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

function generateToken( params = {}){
    return jwt.sign( params, authConfig.secret, { // Configurando o nosso token
        expiresIn: 86400 // Expira em 1 dia
    } )
}

module.exports = {

    async index(req, res) {
        try{
            const users = await User.find({});
            return res.send({ users })
        }catch(err){
            return res.status(400).send({error: 'Fail to get users'})
        }
    },

    async detail(req, res) { // Get user detail
        const userId = req.params.id;

        await User.findOne({_id: userId}, (err) => {
            if(err) {
                return res.status(400).send({error: 'User not found', err})
            }
        })
        
        try {
            const userRecipes = await Recipe.find({authorId: userId});
            
            return res.send({ userRecipes })
        }catch(err){
            return res.status(400).send({error: 'Fail to get user detail'})
        }

    },

    async create(req, res){
        const { email } = req.body;

        try {
            if( await User.findOne({ email })){
                return res.status(400).send({error: 'User already exists.'})
            }
            const user = await User.create(req.body);
            
            user.password = undefined; // Para não vir a senha no select

            return res.send({ 
                user,
                token: generateToken({id: user.id, username: user.name})
            })
        }catch(err) {
            //error
            return res.status(400).send({ error: 'Registration failed' })
        }
    },

    async authenticate(req, res) {

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password'); // Encontra um email igual ao do req.body, e busca a senha tbm

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
    }
}