const express = require('express');

const authMiddleware = require('./middleware/auth');

const RecipeController = require('./controllers/RecipeController');
const UserController = require('./controllers/UserController');

const router = express.Router()

// User routes
router.get('/user/all', UserController.index )
router.get('/user/:id', UserController.detail)
router.post('/user/create', UserController.create)
router.post('/user/authenticate', UserController.authenticate)


// Recipes routes
router.get('/recipe', RecipeController.index); // Recipe list
router.get('/recipe/search', RecipeController.search);

router.use(authMiddleware) // Check token 

router.post('/recipe/create', RecipeController.create);
router.put('/recipe/update', RecipeController.update);
router.delete('/recipe/delete/:recipe', RecipeController.delete);

module.exports = router;