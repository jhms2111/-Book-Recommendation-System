const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: false },
    googleId: { type: String },
});

// Verifica se o modelo já foi compilado, caso contrário, cria o modelo
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
