import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Rating } from '@mui/material';

const BookReviewPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [isPageCreated, setIsPageCreated] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const isGoogleBook = !bookId.includes('OL');

        if (isGoogleBook) {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
          const data = await response.json();

          setBookDetails({
            title: data.volumeInfo.title || 'Título não disponível',
            description: data.volumeInfo.description || 'Nenhum resumo disponível.',
            authors: data.volumeInfo.authors || ['Desconhecido'],
            publisher: data.volumeInfo.publisher || 'Desconhecida',
            publishedDate: data.volumeInfo.publishedDate || 'Desconhecida',
            pageCount: data.volumeInfo.pageCount || 'Desconhecido',
            imageLinks: data.volumeInfo.imageLinks,
            link: data.volumeInfo.infoLink || data.volumeInfo.previewLink || null,
          });
        } else {
          const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
          const data = await response.json();

          setBookDetails({
            title: data.title || 'Título não disponível',
            description: data.description?.value || data.description || 'Nenhum resumo disponível.',
            authors: data.authors ? await Promise.all(
              data.authors.map(async (author) => {
                const authorResponse = await fetch(`https://openlibrary.org${author.author.key}.json`);
                const authorData = await authorResponse.json();
                return authorData.name;
              })
            ) : ['Desconhecido'],
            publisher: 'Open Library',
            publishedDate: data.created?.value || 'Desconhecida',
            pageCount: data.pages || 'Desconhecido',
            imageLinks: {
              thumbnail: `https://covers.openlibrary.org/b/id/${data.covers?.[0]}-M.jpg`,
            },
            link: `https://openlibrary.org${data.key}`,
          });
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleAddToUserPage = async (status) => {
    try {
      const token = localStorage.getItem("authToken");

      console.log("🔍 Enviando token na requisição:", token);

      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const bookData = {
        bookId,
        title: bookDetails.title,
        thumbnail: bookDetails.imageLinks?.thumbnail || '',
        status,
      };

      const response = await axios.post("http://localhost:5000/api/books", bookData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Livro adicionado com sucesso!", response.data);

      if (response.status === 201) {
        alert("Livro adicionado com sucesso!");
        navigate("/my-books");
      }
    } catch (error) {
      console.error("❌ Erro ao adicionar o livro:", error.response ? error.response.data : error);
      alert("Erro ao adicionar o livro. Tente novamente.");
    }
  };

  const handleSubmitReview = async () => {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('Usuário não autenticado.');
            return;
        }

        const reviewData = {
            content: comment,
            bookId,
            bookTitle: bookDetails.title, // 🔥 Agora enviamos o nome do livro corretamente!
            rating,
            type: 'review'
        };

        console.log("📩 Enviando review:", reviewData); // 🔍 Log para verificação

        await axios.post('http://localhost:5000/api/postagens', reviewData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        alert('Comentário e avaliação enviados com sucesso!');
        setComment('');
        setRating(0);
    } catch (error) {
        console.error('❌ Erro ao enviar avaliação:', error);
        alert('Erro ao enviar avaliação. Tente novamente.');
    }
};







  return (
    <Box sx={{ padding: '20px', textAlign: 'center', marginTop: '95px' }}>
      {!isPageCreated ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            Pronto para criar uma página de avaliação?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsPageCreated(true)}
            sx={{ marginTop: '20px' }}
          >
            Criar Página de Avaliação
          </Button>
        </Box>
      ) : (
        <Box>
          
          <img
            src={bookDetails.imageLinks?.thumbnail || ''}
            alt={bookDetails.title}
            style={{ height: '200px', margin: '20px 0' }}
          />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '10px' }}>
            {bookDetails.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {bookDetails.description}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Autores:</strong> {bookDetails.authors?.join(', ') || 'Desconhecido'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Editora:</strong> {bookDetails.publisher || 'Desconhecida'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Data de Publicação:</strong> {bookDetails.publishedDate || 'Desconhecida'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Número de Páginas:</strong> {bookDetails.pageCount || 'Desconhecido'}
          </Typography>

          {/* Botão "Lido" (Removido "Vou Ler") */}
          <Box sx={{ marginTop: '20px' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAddToUserPage('Lido')}
            >
              Lido
            </Button>
          </Box>

          {/* Botão para acessar o link do livro */}
          {bookDetails.link && (
            <Box sx={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(bookDetails.link, '_blank')}
              >
                Ler o Livro
              </Button>
            </Box>
          )}

          {/* Espaço para comentário e avaliação */}
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h6">Deixe seu comentário:</Typography>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            <Typography variant="h6">Avalie o livro:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: '20px' }}
              onClick={handleSubmitReview} // ✅ Agora a função é usada corretamente
            >
              Enviar Avaliação
            </Button>

          </Box>

          {/* Botão de voltar para a página inicial */}
          <Box sx={{ marginTop: '40px' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/')}
            >
              Voltar para a Página Inicial
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BookReviewPage;
