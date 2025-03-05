const express = require('express');
const postagemController = require('../controllers/postagemController');

console.log("📌 Funções carregadas no postagemController:", Object.keys(postagemController));

const authenticateUser = require('../../adapters/controllers/middleware/authenticateUser');

const router = express.Router();

// Rota para criar postagens (postagem normal ou avaliação)
router.post('/postagens', authenticateUser, postagemController.createPost);

// Rota para obter todas as postagens (posts normais + avaliações)
router.get('/postagens', postagemController.getPosts);

// Criar uma avaliação de livro (REVIEW)
router.post('/reviews', authenticateUser, postagemController.createPost);

// Rota para buscar apenas avaliações de um livro
router.get('/postagens/reviews/:bookId', postagemController.getBookReviews);

router.get('/ranking', postagemController.getTopRatedBooks);



module.exports = router;
