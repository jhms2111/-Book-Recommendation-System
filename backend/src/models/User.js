// src/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
}, { timestamps: true });

// Evitar que o modelo seja redefinido se já estiver compilado
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
