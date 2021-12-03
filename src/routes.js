const express = require('express');

const RecipeRouter = require('./routes/Recipe');
const RecipeCategoriesRouter = require('./routes/Categories');
const UserRouter = require('./routes/User');

const router = express.Router()

// User routes
router.use('/user', UserRouter);
// Recipes routes
router.use('/recipe', RecipeRouter);
// Recipe Categories
router.use('/categories', RecipeCategoriesRouter);

module.exports = router;