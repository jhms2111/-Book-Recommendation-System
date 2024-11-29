const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();  // Defina o router aqui

// Middleware de autenticação
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Espera que o token venha no cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, 'seuSegredoAqui'); // Verifica a validade do token
    req.user = decoded; // Decodifica o usuário e armazena no objeto req
    next(); // Passa para o próximo middleware ou a rota
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

// Rota para criar postagem, usando o middleware de autenticação
router.post('/postagens', verifyToken, async (req, res) => {
  // Lógica para criar postagem (com base na lógica do seu controlador)
  res.send('Postagem criada');
});

module.exports = router; // Exporte o router para ser utilizado em outros arquivos
