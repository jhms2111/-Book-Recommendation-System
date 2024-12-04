const express = require('express');
const postagemController = require('../controllers/postagemController');
const authenticateUser = require('../../adapters/controllers/middleware/authenticateUser'); // Importe o middleware de autenticação

const router = express.Router();

// Criar postagem (rota protegida)
router.post('/postagens', authenticateUser, postagemController.createPost); // O middleware de autenticação é aplicado aqui

// Buscar postagens com paginação
router.get('/postagens', postagemController.getPosts);

// Curtir uma postagem
router.put('/postagens/:id/like', postagemController.likePost);

// Adicionar comentário
router.post('/postagens/:id/comment', postagemController.addComment);

module.exports = router;
