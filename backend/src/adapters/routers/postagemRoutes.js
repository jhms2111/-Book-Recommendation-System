const express = require('express');
const postagemController = require('../controllers/postagemController');
const authenticateUser = require('../../adapters/controllers/middleware/authenticateUser');
const isAdmin = require('../../adapters/controllers/middleware/isAdmin');

console.log("📌 Funções carregadas no postagemController:", Object.keys(postagemController));

const router = express.Router();

// 🔹 Usuário autenticado pode visualizar postagens (feed normal)
router.get('/postagens', authenticateUser, postagemController.getPosts);

// 🔹 Admin pode visualizar postagens (interface separada no frontend)
router.get('/admin/postagens', authenticateUser, isAdmin, async (req, res) => {
    try {
        const postagens = await postagemController.getPosts(); 
        res.json(postagens);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar postagens.", details: error });
    }
});

// 🔹 Usuários autenticados podem criar postagens (posts normais ou avaliações)
router.post('/postagens', authenticateUser, postagemController.createPost);

// 🔹 Buscar avaliações de um livro (apenas para usuários autenticados)
router.get('/postagens/reviews/:bookId', authenticateUser, postagemController.getBookReviews);

// 🔹 Rota de ranking de livros (apenas para usuários autenticados)
router.get('/ranking', authenticateUser, postagemController.getTopRatedBooks);

// 🔹 Admin pode excluir qualquer postagem
router.delete('/postagens/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
        const postId = req.params.id;
        await postagemController.deletePost(postId);
        res.json({ message: "Postagem excluída com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir postagem.", details: error });
    }
});

module.exports = router;
