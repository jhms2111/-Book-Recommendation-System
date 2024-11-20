const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer Token

    if (!token) return res.status(401).json({ error: 'Acesso não autorizado.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token com a chave secreta
        req.user = decoded; // Adiciona os dados do usuário ao request
        next(); // Passa para a próxima função na rota
    } catch (error) {
        res.status(403).json({ error: 'Token inválido.' });
    }
};

module.exports = authenticateUser;
