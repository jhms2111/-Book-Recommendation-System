// src/adapters/controllers/booksRoutes.js

const express = require('express');
const BookController = require('../controllers/books/booksController');
const router = express.Router();

// Rota para buscar livros
router.get('/books/search', BookController.searchBooks);

// Rota para obter detalhes de um livro
router.get('/books/:bookId', BookController.getBookDetails);

module.exports = router;
