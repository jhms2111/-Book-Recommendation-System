const express = require('express');
const passport = require('passport');

const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Certifique-se de que as variáveis de ambiente estão configuradas

function generateAuthToken(user) {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    // Use uma chave secreta segura armazenada em uma variável de ambiente
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}


// Rota para autenticação com Google
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), async (req, res) => {
    try {
        console.log("Usuário autenticado:", req.user); // Debug para ver se req.user existe

        // Verifica se req.user foi preenchido corretamente
        if (!req.user) {
            console.error("Erro: req.user está indefinido!");
            return res.status(500).send("Erro interno: Usuário não autenticado.");
        }

        // Define os dados do usuário corretamente
        const user = {
            id: req.user._id || req.user.id,  // Dependendo do modelo, pode ser _id ou id
            name: req.user.name || req.user.displayName,
            email: req.user.email || req.user.emails?.[0]?.value,
            googleId: req.user.googleId || req.user.id
        };

        console.log("Usuário extraído:", user); // Depuração para verificar os dados

        // Gera o token apenas se o usuário existir
        const authToken = generateAuthToken(user);

        res.redirect(`https://book-recommendation-system-omega.vercel.app/auth/success?token=${authToken}`);
    } catch (err) {
        console.error("Erro no callback do Google OAuth:", err);
        return res.status(500).send("Erro ao autenticar com o Google.");
    }
});





module.exports = router;

//https://console.cloud.google.com/apis/credentials/oauthclient/462938419440-fq5819gf7jf5hdm137mi24ad4ktjgce1.apps.googleusercontent.com?project=liquid-anchor-440817-c9