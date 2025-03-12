const express = require('express');
const postagemController = require('../controllers/postagemController');
const authenticateUser = require('../../adapters/controllers/middleware/authenticateUser');
const isAdmin = require('../../adapters/controllers/middleware/isAdmin');

console.log("📌 Funções carregadas no postagemController:", Object.keys(postagemController));

const router = express.Router();

// 🔹 Usuário autenticado pode visualizar postagens (feed normal)
router.get('/postagens', authenticateUser, postagemController.getPosts);

// 🔹 Admin pode visualizar postagens (interface separada no frontend)
router.get('/api/postagens', authenticateUser, isAdmin, async (req, res) => {
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


// 🔥 Rota para excluir uma postagem (SOMENTE ADMIN)
router.delete('/api/postagens/:postId', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { postId } = req.params;
        console.log(`🛠 Tentando excluir a postagem: ${postId}`); // Log para depuração

        // Verifica se o ID tem 24 caracteres (formato do MongoDB)
        if (!postId || postId.length !== 24) {
            console.error("❌ ERRO: ID inválido ou mal formatado.");
            return res.status(400).json({ error: "ID da postagem inválido." });
        }

        // 🔹 Tenta deletar a postagem
        const deletedPost = await postagemController.deletePost(postId);

        if (!deletedPost) {
            console.error("❌ ERRO: Postagem não encontrada.");
            return res.status(404).json({ error: "Postagem não encontrada." });
        }

        console.log("✅ Postagem excluída com sucesso!");
        res.json({ message: "✅ Postagem excluída com sucesso!" });

    } catch (error) {
        console.error("❌ ERRO AO EXCLUIR POSTAGEM:", error);
        res.status(500).json({ error: "Erro ao excluir postagem.", details: error.message });
    }
});


module.exports = router;
