const GoogleBooksClient = require('../../adapters/apiClients/GoogleBooksClient');

class SearchBooks {
  async execute(query) {
    if (!query) {
      throw new Error('Uma consulta de pesquisa é necessária');
    }
    return await GoogleBooksClient.searchBooks(query);
  }
}

module.exports = new SearchBooks();
