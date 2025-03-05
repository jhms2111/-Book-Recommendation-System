const mongoose = require('mongoose');

const postagemSchema = new mongoose.Schema({
    content: { type: String, required: true }, // Comentário do usuário
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    type: { type: String, enum: ['post', 'review'], required: true },
    bookId: { type: String, default: null }, // ID do livro
    bookTitle: { type: String, default: null }, // 🔥 Agora garantimos que o título pode ser salvo!
    rating: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Postagem', postagemSchema);
