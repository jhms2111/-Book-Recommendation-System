// src/pages/BookSearchPage.js
import  { useState } from 'react';
import axios from 'axios';
import BookList from '../../components/Books/BookList'; // Importando o componente da lista de livros

function BookSearchPage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

// src/pages/BookSearchPage.js
const searchBooks = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await axios.get(`http://localhost:5000/api/books/search?q=${query}`);

    console.log("Dados dos livros:", response.data); // Adicione este log
    setBooks(response.data);
  } catch (error) {
    console.error(error); // log do erro para inspeção
    setError('Erro ao buscar livros. Tente novamente.');
  }
  setLoading(false);
}


  return (
    <div>
      <h1>Busca de Livros</h1>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome do livro"
        />
        <button onClick={searchBooks} disabled={loading || !query}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p>{error}</p>}
      
      <BookList books={books} /> {/* Renderiza a lista de livros */}
    </div>
  );
}

export default BookSearchPage;
