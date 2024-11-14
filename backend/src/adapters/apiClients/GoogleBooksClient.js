// src/adapters/apiClients/GoogleBooksClient.js
const axios = require('axios');

class GoogleBooksClient {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    this.apiKey = process.env.GOOGLE_BOOKS_API_KEY; // Verifique se a chave está configurada no .env
  }

  // Função para buscar livros com base em uma query
  async searchBooks(query) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          key: this.apiKey,
        },
      });
      return response.data.items; // Retorna a lista de livros
    } catch (error) {
      console.error('Erro ao buscar livros na Google Books API:', error);
      throw new Error('Erro ao buscar dados da Google Books API');
    }
  }

  // Função para obter detalhes de um livro específico pelo ID
  async getBookDetails(bookId) {
    try {
      const url = `${this.baseUrl}/${bookId}`;
      const response = await axios.get(url, {
        params: {
          key: this.apiKey,
        },
      });
      return response.data; // Retorna os detalhes do livro
    } catch (error) {
      console.error('Erro ao obter detalhes do livro na Google Books API:', error);
      throw new Error('Erro ao obter detalhes do livro');
    }
  }
}

module.exports = new GoogleBooksClient();
