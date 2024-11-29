// backend/src/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: { type: String, required: true }, // ID do livro da Google Books API
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID do usuário que fez a avaliação
  rating: { type: Number, min: 1, max: 5, required: true }, // Avaliação de 1 a 5
  comment: { type: String, required: true }, // Comentário do usuário
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
