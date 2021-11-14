const mongoose = require('mongoose');
const { Schema } = mongoose

const ResourceSchema = new Schema({
    cloudinary_id: {
        type: String,
        required: true
    },
    secure_url: {
        type: String,
        required: true
    },
},
{
    timestamps: true
}
)

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;
