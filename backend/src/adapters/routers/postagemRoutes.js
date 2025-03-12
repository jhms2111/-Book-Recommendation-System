const express = require('express');
const postagemController = require('../controllers/postagemController');
const authenticateUser = require('../../adapters/controllers/middleware/authenticateUser');
const isAdmin = require('../../middlewares/isAdmin'); // Certifique-se de importar

console.log("📌 Funções carregadas no postagemController:", Object.keys(postagemController));

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



// 🔹 Rota para obter TODAS as postagens e avaliações (somente para ADMIN)
router.get('/comentariosadmin', authenticateUser, isAdmin, async (req, res) => {
    try {
        const postagens = await postagemController.getPosts(); // Obtém todas as postagens
        res.json(postagens);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar postagens.", details: error });
    }
});

// 🔹 Rota para excluir qualquer postagem ou avaliação (somente ADMIN)
router.delete('/comentariosadmin/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
        const postId = req.params.id;
        await postagemController.deletePost(postId);
        res.json({ message: "Postagem excluída com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir postagem.", details: error });
    }
});


module.exports = router;


