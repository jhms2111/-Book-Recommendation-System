// src/adapters/controllers/BookController.js
const GoogleBooksClient = require('../../apiClients/GoogleBooksClient');

class BookController {
  static async searchBooks(req, res) {
    const { q } = req.query;
    try {
      const books = await GoogleBooksClient.searchBooks(q);
      const formattedBooks = books.map((book) => ({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['Autor desconhecido'],
        description: book.volumeInfo.description || 'Sem descrição disponível',
        pageCount: book.volumeInfo.pageCount,
        categories: book.volumeInfo.categories || [],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
        language: book.volumeInfo.language,
        previewLink: book.volumeInfo.previewLink,
        infoLink: book.volumeInfo.infoLink,
      }));
      res.json(formattedBooks);
    } catch (error) {
      console.error('Erro ao buscar livros:', error.message);
      res.status(500).json({ error: 'Erro ao buscar livros' });
    }
  }

  static async getBookDetails(req, res) {
    const { bookId } = req.params;
    try {
      const bookDetails = await GoogleBooksClient.getBookDetails(bookId);
      res.json(bookDetails);
    } catch (error) {
      console.error('Erro ao obter detalhes do livro:', error.message);
      res.status(404).json({ error: 'Livro não encontrado' });
    }
  }
}

module.exports = BookController;
