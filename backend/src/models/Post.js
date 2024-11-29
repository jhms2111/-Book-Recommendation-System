const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relaciona com o usuário
  content: { type: String, required: true }, // Conteúdo da postagem
  image: { type: String }, // Para armazenar a imagem, se necessário
  createdAt: { type: Date, default: Date.now }, // Data de criação
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Usuários que curtiram a postagem
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }] // Comentários da postagem
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
