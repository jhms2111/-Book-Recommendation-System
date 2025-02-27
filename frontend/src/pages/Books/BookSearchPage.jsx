import { useState } from 'react';
import axios from 'axios';
import BookList from '../../components/Books/BookList'; // Importando o componente da lista de livros

function BookSearchPage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);  // Estado inicial é um array vazio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const googleBooksResponse = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const openLibraryResponse = axios.get(`https://openlibrary.org/search.json?q=${query}`);
  
      // Aguarda ambas as respostas
      const [googleBooksData, openLibraryData] = await Promise.all([googleBooksResponse, openLibraryResponse]);
  
      const googleBooks = googleBooksData.data.items || [];
      const openLibraryBooks = openLibraryData.data.docs || [];
  
      // Mesclar os resultados (simples concatenação para o exemplo)
      const allBooks = [...googleBooks, ...openLibraryBooks];
  
      // Processar os dados de ambos os serviços, como desejar
      setBooks(allBooks); // Defina o estado com os livros encontrados
    } catch (error) {
      console.error(error);
      setError('Erro ao buscar livros. Tente novamente.');
    }
    setLoading(false);
  };
  ;

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
      
      {/* 🔹 Garantindo que 'books' seja sempre um array */}
      <BookList books={Array.isArray(books) ? books : []} />  
    </div>
  );
}

export default BookSearchPage;
