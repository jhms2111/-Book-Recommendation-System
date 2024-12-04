// src/models/User.js

/// src/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String },  // Nome do usuário (do Google, por exemplo)
    nomeCadastrado: { 
        type: String, 
        required: function() { return !this.googleId; }  // `nomeCadastrado` é obrigatório apenas para usuários cadastrados manualmente
    },  
    email: { type: String, required: true, unique: true },
    senha: { type: String },  // Apenas para usuários cadastrados manualmente
    googleId: { type: String },  // Apenas para usuários via Google
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
