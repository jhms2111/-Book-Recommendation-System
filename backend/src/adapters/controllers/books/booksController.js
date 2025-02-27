const axios = require('axios');

class BookController {
  static async searchBooks(req, res) {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Nenhuma query de busca foi fornecida' });
    }

    try {
      const googleBooksResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
      const googleBooks = googleBooksResponse.data.items || [];

      const openLibraryResponse = await axios.get(`https://openlibrary.org/search.json?q=${q}`);
      const openLibraryBooks = openLibraryResponse.data.docs || [];

      const formattedGoogleBooks = googleBooks.map((book) => ({
        id: book.id.toString(),
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['Autor desconhecido'],
        description: book.volumeInfo.description || 'Sem descrição disponível',
        pageCount: book.volumeInfo.pageCount || 'Desconhecido',
        categories: book.volumeInfo.categories || [],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150.png?text=Sem+Capa',
        language: book.volumeInfo.language,
        previewLink: book.volumeInfo.previewLink || '#',
        infoLink: book.volumeInfo.infoLink || '#',
      }));

      const formattedOpenLibraryBooks = openLibraryBooks.map((book) => ({
        id: book.key.replace('/works/', ''),
        title: book.title,
        authors: book.author_name || ['Autor desconhecido'],
        description: 'Descrição não disponível',
        pageCount: 'Desconhecido',
        categories: [],
        thumbnail: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/100x150.png?text=Sem+Capa',
        language: book.language ? book.language[0] : 'Desconhecido',
        previewLink: `https://openlibrary.org${book.key}`,
        infoLink: `https://openlibrary.org${book.key}`,
      }));

      const allBooks = [...formattedGoogleBooks, ...formattedOpenLibraryBooks];

      res.json(allBooks);
    } catch (error) {
      console.error('Erro ao buscar livros:', error.message);
      res.status(500).json({ error: 'Erro ao buscar livros' });
    }
  }

  // ✅ Adicionando `getBookDetails` para evitar erro no Express
  static async getBookDetails(req, res) {
    const { bookId } = req.params;

    try {
      // Busca detalhes no Google Books
      const googleBookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
      const googleBook = googleBookResponse.data;

      if (googleBook) {
        return res.json({
          id: googleBook.id,
          title: googleBook.volumeInfo.title,
          authors: googleBook.volumeInfo.authors || ['Autor desconhecido'],
          description: googleBook.volumeInfo.description || 'Sem descrição disponível',
          pageCount: googleBook.volumeInfo.pageCount || 'Desconhecido',
          categories: googleBook.volumeInfo.categories || [],
          thumbnail: googleBook.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150.png?text=Sem+Capa',
          language: googleBook.volumeInfo.language,
          previewLink: googleBook.volumeInfo.previewLink || '#',
          infoLink: googleBook.volumeInfo.infoLink || '#',
        });
      }

      // Se não encontrar no Google, tenta no Open Library
      const openLibraryResponse = await axios.get(`https://openlibrary.org/works/${bookId}.json`);
      const openLibraryBook = openLibraryResponse.data;

      if (openLibraryBook) {
        return res.json({
          id: bookId,
          title: openLibraryBook.title,
          authors: openLibraryBook.authors ? openLibraryBook.authors.map(a => a.name) : ['Autor desconhecido'],
          description: openLibraryBook.description || 'Descrição não disponível',
          pageCount: 'Desconhecido',
          categories: [],
          thumbnail: 'https://via.placeholder.com/100x150.png?text=Sem+Capa',
          language: 'Desconhecido',
          previewLink: `https://openlibrary.org/works/${bookId}`,
          infoLink: `https://openlibrary.org/works/${bookId}`,
        });
      }

      return res.status(404).json({ error: 'Livro não encontrado' });
    } catch (error) {
      console.error('Erro ao obter detalhes do livro:', error.message);
      return res.status(500).json({ error: 'Erro ao obter detalhes do livro' });
    }
  }
}

module.exports = BookController;
