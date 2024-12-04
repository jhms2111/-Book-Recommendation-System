// postagemModel.js

const mongoose = require('mongoose');

// Define o schema para postagens
const postagemSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Refere-se ao modelo User
        required: true
    },
    image: String,
    likes: [mongoose.Schema.Types.ObjectId],
    comments: [{ userId: mongoose.Schema.Types.ObjectId, content: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Modelo de Postagem
module.exports = mongoose.model('Postagem', postagemSchema);
