const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'offline',
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        type: String,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
