import { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; // ✅ Importando o hook de navegação

const UserBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Hook para navegação

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('❌ Usuário não autenticado.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBooks(response.data.books);
      } catch (error) {
        console.error('❌ Erro ao buscar os livros do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  const handleRemoveBook = async (bookId) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este livro?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('❌ Usuário não autenticado.');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log('✅ Livro removido com sucesso!');
        setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId));
      } else {
        console.error('⚠️ Erro ao remover livro:', response.data);
      }
    } catch (error) {
      console.error('❌ Erro ao remover o livro:', error.response ? error.response.data : error);
    }
  };

  // ✅ Modificando para redirecionar para a página de avaliação
  const handleBookClick = (book) => {
    console.log(`📖 Redirecionando para avaliação do livro: ${book.bookId}`);
    navigate(`/book-review/${book.bookId}`); // ✅ Agora redireciona para a página correta
  };

  return (
    <Box sx={{ padding: '80px 20px', textAlign: 'center', background: '#1c0101', minHeight: '100vh' }}>
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        fontFamily: 'Georgia, serif',
        color: '#5A3E36',
        marginTop: '0px', // 🔥 Move o título mais para cima
      }}
    >
      📚 Minha Estante de Livros
    </Typography>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1c0101',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
      >
        {books.map((book) => (
          <Box key={book.bookId} sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={book.title} placement="top">
              <IconButton
                onClick={() => handleBookClick(book)} // ✅ Agora chama a função que redireciona para a BookReviewPage
                sx={{
                  background: '#8B5A2B',
                  color: '#FFF',
                  width: '100px',
                  height: '140px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '3px 3px 8px rgba(0,0,0,0.3)',
                  '&:hover': { background: '#654321' },
                }}
              >
                <img
                  src={book.thumbnail || 'https://via.placeholder.com/100x140'}
                  alt={book.title}
                  style={{ width: '80px', height: '110px', borderRadius: '5px' }}
                />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => handleRemoveBook(book.bookId)}
              sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserBooksPage;
