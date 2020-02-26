const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    full_text: {
        type: String,
        required: true
    },
    post_image: {
        type: String,
        required: false
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Post', postSchema);