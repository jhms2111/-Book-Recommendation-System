// Middleware para autenticação e extração do userId do token JWT
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token JWT do cabeçalho

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Certifique-se de que o segredo seja o mesmo usado na geração do token
        req.user = decoded; // Salva o decoded no objeto req (que estará disponível nos controladores)
        next(); // Passa o controle para o próximo middleware (a função createPost, por exemplo)
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = authenticateUser;
