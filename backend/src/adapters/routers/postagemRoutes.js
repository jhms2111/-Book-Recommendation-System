const express = require('express');
const postagemController = require('../controllers/postagemController'); // Verifique se o caminho está correto
const authenticateUser = require('../controllers/middleware/authenticateUser'); // Middleware de autenticação

const router = express.Router();

// Criar postagem (rota protegida)
router.post('/postagens', authenticateUser, postagemController.createPost); // O middleware de autenticação é aplicado aqui

// Rota para buscar os comentários de uma postagem
router.get('/postagens/:id/comments', authenticateUser, postagemController.getComments);

// Curtir uma postagem
router.put('/postagens/:id/like', postagemController.likePost);

// Adicionar comentário
router.post('/postagens/:id/comment', postagemController.addComment); // Rota para adicionar comentário

// Rota para buscar postagens (com paginação)
router.get('/postagens', postagemController.getPosts);

// Rota para buscar postagem pelo ID
router.get('/postagens/:postId', postagemController.getPostById);

module.exports = router;
