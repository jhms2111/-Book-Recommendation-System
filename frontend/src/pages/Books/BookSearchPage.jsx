import { useState } from 'react';
import axios from 'axios';
import BookList from '../../components/Books/BookList';
import { Box, TextField, Button, Typography, CircularProgress, Container } from '@mui/material';
import { styled } from '@mui/system';

const SearchContainer = styled(Container)({
  backgroundColor: '#1c0101',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  color: '#d2b48c',
  width: '100vw',
  maxWidth: '100%',
  overflowX: 'hidden',
});

const BookListContainer = styled(Box)({
  width: '100%',
  marginTop: '20px',
  backgroundColor: '#1c0101', // Manteniendo el color de fondo de la página
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

const SearchInput = styled(TextField)({
  width: '80%',
  maxWidth: '500px',
  marginBottom: '20px',
  backgroundColor: '#fff',
  borderRadius: '5px',
});

const SearchButton = styled(Button)({
  backgroundColor: '#d2b48c',
  color: '#1c0101',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#b08968',
  },
});

const Title = styled(Typography)({
  textAlign: 'center',
  fontSize: '2rem',
  width: '100%',
  '@media (max-width: 600px)': {
    fontSize: '1.5rem',
  },
});

function BookSearchPage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const googleBooksResponse = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const openLibraryResponse = axios.get(`https://openlibrary.org/search.json?q=${query}`);
  
      const [googleBooksData, openLibraryData] = await Promise.all([googleBooksResponse, openLibraryResponse]);
  
      const googleBooks = googleBooksData.data.items || [];
      const openLibraryBooks = openLibraryData.data.docs || [];
  
      const allBooks = [...googleBooks, ...openLibraryBooks];
      setBooks(allBooks);
    } catch (error) {
      console.error(error);
      setError('Error al buscar libros. Intente nuevamente.');
    }
    setLoading(false);
  };

  return (
    <SearchContainer>
      <Title variant="h3" gutterBottom>
        Búsqueda de Libros
      </Title>
      <SearchInput
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escriba el nombre del libro"
      />
      <SearchButton onClick={searchBooks} disabled={loading || !query}>
        {loading ? <CircularProgress size={24} /> : 'Buscar'}
      </SearchButton>
      {error && <Typography color="error" sx={{ marginTop: '20px' }}>{error}</Typography>}
      <BookListContainer>
        <BookList books={Array.isArray(books) ? books : []} />
      </BookListContainer>
    </SearchContainer>
  );
}

export default BookSearchPage;
