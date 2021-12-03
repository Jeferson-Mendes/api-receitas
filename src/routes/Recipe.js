const Router = require('express').Router
const RecipeRouter = Router();

const upload = require('../config/multer');
const authMiddleware = require('../middleware/auth');

const RecipeController =  require('../controllers/RecipeController');

RecipeRouter.get('/', RecipeController.index); // Recipe list
RecipeRouter.get('/:recipeId', RecipeController.detail);
RecipeRouter.get('/search', RecipeController.search);

RecipeRouter.use(authMiddleware) // Check token 

RecipeRouter.post('/recipe/create', upload.single('image'), RecipeController.create);
RecipeRouter.put('/recipe/update/:recipeId', upload.single('image'), RecipeController.update);
RecipeRouter.delete('/recipe/delete/:recipe', RecipeController.delete);

module.exports = RecipeRouter;
