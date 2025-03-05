const express = require('express');
const router = express.Router();
const authenticateUser = require('../controllers/middleware/authenticateUser');
const UserBook = require('../../models/UserBooks'); // Certifique-se de que o nome do modelo está correto!

// 🔥 ROTA PARA REMOVER LIVRO: `/api/books/:bookId`
router.delete('/:bookId', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id; // Pega o ID do usuário autenticado
        const { bookId } = req.params; // Pega o ID do livro a ser removido

        console.log(`🗑️ Tentando remover o livro ID: ${bookId} para o usuário: ${userId}`);

        const book = await UserBook.findOneAndDelete({ userId, bookId });

        if (!book) {
            return res.status(404).json({ message: 'Livro não encontrado ou já removido' });
        }

        console.log("✅ Livro removido com sucesso!");
        res.status(200).json({ message: 'Livro removido com sucesso!' });

    } catch (error) {
        console.error('❌ Erro ao remover livro:', error);
        res.status(500).json({ message: 'Erro ao remover livro do MongoDB' });
    }
});

// 🔹 Outras rotas já existentes...
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { bookId, title, thumbnail, status } = req.body;
        const userId = String(req.user.id);

        const existingBook = await UserBook.findOne({ userId, bookId });

        if (existingBook) {
            return res.status(400).json({ message: 'Livro já adicionado!' });
        }

        const newBook = new UserBook({ userId, bookId, title, thumbnail, status });
        await newBook.save();
        res.status(201).json({ message: 'Livro salvo com sucesso!', book: newBook });

    } catch (error) {
        console.error('❌ Erro ao salvar livro:', error);
        res.status(500).json({ message: 'Erro ao salvar livro no MongoDB' });
    }
});

router.get("/", authenticateUser, async (req, res) => {
    try {
        console.log("📌 Buscando livros do usuário:", req.user.id);
        const books = await UserBook.find({ userId: req.user.id }).sort({ createdAt: -1 });

        if (!books.length) {
            return res.status(200).json({ books: [] });
        }

        console.log("✅ Livros encontrados:", books.length);
        res.status(200).json({ books });
    } catch (error) {
        console.error("❌ Erro ao buscar livros:", error);
        res.status(500).json({ message: "Erro ao buscar livros" });
    }
});

module.exports = router;
