const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Token obtido do cabeçalho
    if (!token) {
        return res.status(401).json({ error: 'Acesso não autorizado. Token ausente.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
        if (decoded.exp < currentTime) {
            return res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

module.exports = authenticateUser;
