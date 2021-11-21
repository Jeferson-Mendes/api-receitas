const { Schema } = require("mongoose");
const mongoose = require('mongoose');
const { characterRemove } = require("../utils");

const RecipeCategorySchema = new Schema({
    name: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const RecipeCategory = mongoose.model('RecipeCategory', RecipeCategorySchema);

module.exports = RecipeCategory;
