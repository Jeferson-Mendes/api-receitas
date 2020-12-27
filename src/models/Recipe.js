const mongoose = require('../database/index');

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    ingredients: {
        type: [String],
        required: true
    },
    preparation_steps: {
        type: [String],
        required: true
    },
    key_words: {
        type: [String]
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe;