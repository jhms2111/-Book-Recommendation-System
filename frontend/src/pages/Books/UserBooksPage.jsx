import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';

const UserBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
          const token = localStorage.getItem("authToken"); // Use o nome correto do token
      
          if (!token) {
              console.error("❌ Usuário não autenticado.");
              return;
          }
      
          console.log("🔐 Token enviado na requisição:", token);
      
          const response = await axios.get("http://localhost:5000/api/books", {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
  
          console.log("✅ Livros recuperados do backend:", response.data.books);
  
          setBooks(response.data.books);
      } catch (error) {
          console.error("❌ Erro ao buscar os livros do usuário:", error);
      } finally {
          setLoading(false);
      }
  };
  
    

    fetchUserBooks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Typography>Carregando seus livros...</Typography>
      </Box>
    );
  }

  if (books.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h5">Você ainda não adicionou livros.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Meus Livros
      </Typography>
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.bookId}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={book.thumbnail || 'https://via.placeholder.com/150'}
                alt={book.title}
              />
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {book.status}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    // Chamar API para remover o livro
                  }}
                  sx={{ marginTop: '10px' }}
                >
                  Remover
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserBooksPage;
