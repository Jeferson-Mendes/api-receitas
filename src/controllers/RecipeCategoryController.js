const RecipeCategory = require("../models/RecipeCategory")

module.exports = {
    async index(req, res) {
        
        const recipeCategories = await RecipeCategory.find();

        return res.json({ categories: recipeCategories });
    }
}