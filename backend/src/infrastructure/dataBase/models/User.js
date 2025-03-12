const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: false }, // A senha deve ser opcional
    googleId: { type: String }, // Para autenticação via Google
    role: { type: String, enum: ["admin", "user"], default: "user" } // 🔥 Agora com role
});

module.exports = mongoose.model('User', userSchema);
