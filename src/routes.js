const express = require('express');

const authMiddleware = require('./middleware/auth');

const RecipeController = require('./controllers/RecipeController');
const UserController = require('./controllers/UserController');

const upload = require('./config/multer');
const RecipeCategoryController = require('./controllers/RecipeCategoryController');

const router = express.Router()

// User routes
router.get('/user/all', authMiddleware, UserController.index );
router.get('/user/:id', authMiddleware, UserController.detail);
router.post('/user/create', upload.single('image'), UserController.create);
router.post('/user/authenticate', UserController.authenticate);
router.patch('/user/update-photo', authMiddleware, upload.single('image'), UserController.updateResourse);


// Recipes routes
router.get('/recipe', RecipeController.index); // Recipe list
router.get('/recipe/:recipeId', RecipeController.detail);
router.get('/recipe/search', RecipeController.search);

router.use(authMiddleware) // Check token 

router.post('/recipe/create', upload.single('image'), RecipeController.create);
router.put('/recipe/update/:recipeId', upload.single('image'), RecipeController.update);
router.delete('/recipe/delete/:recipe', RecipeController.delete);

// Recipe Categories

router.get('/categories', RecipeCategoryController.index);

module.exports = router;