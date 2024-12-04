const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    // Garantir que o token seja obtido do cabeçalho Authorization
    const token = req.headers['authorization']?.split(' ')[1]; // Pega o token depois de 'Bearer'
    
    if (!token) {
        return res.status(401).json({ error: 'Acesso não autorizado. Token ausente.' });
    }

    try {
        // Decodifica o token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token usando a chave secreta

        req.user = decoded; // Armazena o usuário decodificado no request (req.user)
        next(); // Passa para o próximo middleware ou rota
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

module.exports = authenticateUser;
