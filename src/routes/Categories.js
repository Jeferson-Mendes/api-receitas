const Router = require('express').Router;

const RecipeCategoriesRouter = Router();

const RecipeCategoryController = require('../controllers/RecipeCategoryController')

RecipeCategoriesRouter.get('/', RecipeCategoryController.index);

module.exports = RecipeCategoriesRouter;
