const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Função para gerar um token JWT
function generateAuthToken(user) {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET, // Usa a chave secreta definida no .env
        { expiresIn: '1h' }
    );
}

// Rota para autenticação com Google
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback após autenticação
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('/login');
        }

        const authToken = generateAuthToken(req.user);

        // Redireciona para o frontend com o token JWT
        res.redirect(`https://book-recommendation-system-omega.vercel.app/auth/success?token=${authToken}`);
    }
);

module.exports = router;
