// src/adapters/controllers/booksRoutes.js
const express = require('express');
const router = express.Router();
const BookController = require('./BookController'); // Certifique-se de que o caminho está correto

// Definindo as rotas e chamando os métodos do controlador
router.get('/search', BookController.searchBooks);
router.get('/:bookId', BookController.getBookDetails);

module.exports = router;
