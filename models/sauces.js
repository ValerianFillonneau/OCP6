const mongoose = require('mongoose');

const saucesShema = mongoose.Schema({
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPepper: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
    likes: {type: Number, require: true},
    dislikes: {type: Number, require: true},
    userLiked: {type: [String, userId], require: true},
    userDisliked: {type: [String, userId], require: true}
})

module.exports = mongoose.model('Sauce', saucesShema);