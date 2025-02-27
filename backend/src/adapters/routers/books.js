//books.js
const express = require('express');
const router = express.Router();
const UserBook = require('../../models/UserBook');
const authenticateUser = require('../controllers/middleware/authenticateUser');


// Rota para adicionar um livro ao usuário autenticado
router.post('/user/books', authenticateUser, async (req, res) => {
    try {
      const { bookId, title, thumbnail, status } = req.body;
      const userId = req.user.id; // Obtendo o ID do usuário autenticado do token JWT
  
      // Verifica se o livro já foi adicionado pelo usuário
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
      res.status(200).json({ message: 'Livro salvo com sucesso!' });
  
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      res.status(500).json({ message: 'Erro ao salvar livro no MongoDB' });
    }
  });
  
  // Rota para listar os livros do usuário autenticado
  router.get('/user/books', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id; // Obtém o ID do usuário autenticado pelo token JWT
      const books = await UserBook.find({ userId });
  
      res.status(200).json({ books });
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({ message: 'Erro ao buscar livros' });
    }
  });
  
  module.exports = router;

  // Rota para remover um livro do usuário autenticado
router.delete('/user/books/:bookId', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;
  
      const book = await UserBook.findOneAndDelete({ userId, bookId });
  
      if (!book) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }
  
      res.status(200).json({ message: 'Livro removido com sucesso!' });
    } catch (error) {
      console.error('Erro ao remover livro:', error);
      res.status(500).json({ message: 'Erro ao remover livro do MongoDB' });
    }
  });


  