const mongoose = require('mongoose');

const postagemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referência ao usuário
    content: { type: String, required: true }, // Conteúdo da postagem
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Lista de usuários que curtiram a postagem
    comments: [{ userId: mongoose.Schema.Types.ObjectId, content: String, createdAt: { type: Date, default: Date.now } }], // Comentários
    image: { type: String }, // URL para imagem (caso o usuário queira postar imagens)
});

module.exports = mongoose.model('Postagem', postagemSchema);
