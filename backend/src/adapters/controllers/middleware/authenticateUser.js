const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Pega o token após "Bearer "

    if (!token) {
        return res.status(403).json({ error: 'Token não fornecido.' }); // Se o token não estiver presente
    }

    try {
        // Verifica e decodifica o token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário ao req.user
        next(); // Passa para a próxima função (criar a postagem)
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' }); // Se o token for inválido ou expirado
    }
};

module.exports = authenticateUser;
