const express = require('express');
const postagemController = require('../controllers/postagemController');
const isAdmin = require('../../middlewares/isAdmin');


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

// Rota para listar todos os usuários (somente admin pode acessar)
router.get("/users", isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclui a senha na resposta
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
});



module.exports = router;
