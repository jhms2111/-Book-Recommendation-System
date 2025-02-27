const express = require('express');
const router = express.Router();
const authenticateUser = require('../controllers/middleware/authenticateUser');
const UserBook = require('../../models/UserBooks');

// 🔹 ROTA CORRETA: `/api/books`
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { bookId, title, thumbnail, status } = req.body;
        const userId = String(req.user.id); // 🔥 Pegando ID do usuário autenticado

        const existingBook = await UserBook.findOne({ userId, bookId });

        if (existingBook) {
            return res.status(400).json({ message: 'Livro já adicionado!' });
        }

        const newBook = new UserBook({
            userId,
            bookId,
            title,
            thumbnail,
            status,
        });

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

      // 🔥 Busca apenas os livros do usuário autenticado
      const books = await UserBook.find({ userId: req.user.id }).sort({ createdAt: -1 });

      if (!books.length) {
          return res.status(200).json({ books: [] }); // Retorna um array vazio caso não tenha livros
      }

      console.log("✅ Livros encontrados:", books.length);
      res.status(200).json({ books });
  } catch (error) {
      console.error("❌ Erro ao buscar livros:", error);
      res.status(500).json({ message: "Erro ao buscar livros" });
  }
});



module.exports = router;
