const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: false},
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', async function(next) {

    const hash = await bcrypt.hash(this.password, saltRounds)
    this.password = hash
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User;