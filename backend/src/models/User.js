const mongoose = require('mongoose');

// Schema para um livro individual
const BookSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  status: { type: String, enum: ['Lido', 'Vou Ler'], required: true },
});

// Schema para o usuário
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Salvo como hash
  books: [BookSchema], // Livros associados ao usuário
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
