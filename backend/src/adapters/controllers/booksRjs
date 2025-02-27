const express = require('express');
const BookController = require('./books/booksController');
const router = express.Router();

router.get('/search', BookController.searchBooks);



// Corrigindo a rota para obter detalhes de um livro
router.get('/:bookId', BookController.getBookDetails);

module.exports = router;

