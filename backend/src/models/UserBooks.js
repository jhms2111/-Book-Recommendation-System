const mongoose = require('mongoose');

const UserBookSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // 🔥 Agora userId é String!
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  status: { type: String, enum: ['Lido', 'Vou Ler'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserBook', UserBookSchema);
