const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    status: { type: String, enum: ['Vou Ler', 'Lido'], required: true },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
});

module.exports = mongoose.model('UserBook', userBookSchema);

