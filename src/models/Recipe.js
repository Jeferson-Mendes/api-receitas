const mongoose = require('mongoose');
const { Schema } = mongoose;

const { characterRemove } = require('../utils/index');

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
    category: { type: Schema.Types.ObjectId, ref:'RecipeCategory', required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: false },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

RecipeSchema.pre('save', async function(next){
    const formatedKey_words = characterRemove(this.key_words)
    this.key_words = formatedKey_words
    next()
})

const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe;