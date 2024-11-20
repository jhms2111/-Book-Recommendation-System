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

  const handleAddToUserPage = (status) => {
    const userBooks = JSON.parse(localStorage.getItem('userBooks')) || [];
    const bookData = {
      id: bookId,
      title: bookDetails.title,
      thumbnail: bookDetails.imageLinks?.thumbnail || '',
      status, // "Lido" ou "Vou Ler"
    };

    // Salva no armazenamento local
    localStorage.setItem('userBooks', JSON.stringify([...userBooks, bookData]));

    // Redireciona para a página pessoal
    navigate('/my-books');
  };

  if (!bookDetails) {
    return <Typography>Carregando informações do livro...</Typography>;
  }

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
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
          <Typography variant="h4" gutterBottom>
            Avaliação de: {bookDetails.title}
          </Typography>
          <img
            src={bookDetails.imageLinks?.thumbnail || ''}
            alt={bookDetails.title}
            style={{ height: '200px', margin: '20px 0' }}
          />
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

          {/* Botões "Lido" e "Vou Ler" */}
          <Box sx={{ marginTop: '20px' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAddToUserPage('Lido')}
              sx={{ marginRight: '10px' }}
            >
              Lido
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => handleAddToUserPage('Vou Ler')}
            >
              Vou Ler
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
              onClick={() => {
                console.log('Comentário:', comment);
                console.log('Classificação:', rating);
                alert('Comentário enviado com sucesso!');
                setComment('');
                setRating(0);
              }}
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
