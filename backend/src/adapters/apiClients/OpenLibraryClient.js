// src/adapters/apiClients/OpenLibraryClient.js
const axios = require('axios');

class OpenLibraryClient {
  constructor() {
    this.baseUrl = 'https://openlibrary.org/search.json'; // URL base da API do Open Library
  }

  // Função para buscar livros com base em uma query
  async searchBooks(query) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,  // A query de busca
          limit: 10,  // Limitar a quantidade de livros retornados (opcional)
        },
      });
      return response.data.docs; // Retorna os livros encontrados
    } catch (error) {
      console.error('Erro ao buscar livros na Open Library API:', error);
      throw new Error('Erro ao buscar dados da Open Library API');
    }
  }

  // Função para obter detalhes de um livro específico pelo ID
  async getBookDetails(bookId) {
    try {
      const url = `https://openlibrary.org/works/${bookId}.json`; // URL para detalhes do livro
      const response = await axios.get(url);
      return response.data; // Retorna os detalhes do livro
    } catch (error) {
      console.error('Erro ao obter detalhes do livro na Open Library API:', error);
      throw new Error('Erro ao obter detalhes do livro');
    }
  }
}

module.exports = new OpenLibraryClient();
