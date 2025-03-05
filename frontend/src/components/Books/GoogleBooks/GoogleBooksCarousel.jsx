import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const sliderSettings = {
  dots: true,
  infinite: false, // Mantém a ordem dos livros
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 8,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 4, slidesToScroll: 4 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 3, slidesToScroll: 3 }, // Exibe 3 livros por linha em telas menores
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false, // Remove botões no mobile para melhor UX
        centerMode: false,
        variableWidth: false,
        rows: 2, // Organiza os livros em 2 linhas no mobile
      },
    },
  ],
};

const GoogleBooksCarousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=40'
        );
        const data = await response.json();
        setBooks(data.items || []);
      } catch (error) {
        console.error('Erro ao buscar livros do Google Books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#007BFF', marginBottom: '20px' }} />
        <Typography variant="h6" color="textSecondary">
          Carregando livros do Google Books...
        </Typography>
      </Box>
    );
  }

  if (books.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Nenhum livro encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <Slider {...sliderSettings}>
      {books.map((book) => (
        <Box
          key={book.id}
          sx={{
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => navigate(`/book-review/${book.id}`)}
        >
          {/* Adicionando Tooltip para mostrar o nome do livro */}
          <Tooltip title={book.volumeInfo?.title || 'Título não disponível'} placement="top">
            <Box>
              {/* Capa do Livro */}
              {book.volumeInfo?.imageLinks?.thumbnail ? (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo?.title}
                  style={{
                    height: '150px',
                    width: '100px',
                    objectFit: 'cover',
                    margin: '0 auto',
                    display: 'block',
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: '150px',
                    width: '100px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#aaa',
                    borderRadius: '8px',
                  }}
                >
                  Capa não disponível
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* Selo de Gratuito */}
          {book.saleInfo?.saleability === 'FREE' && (
            <Box
              sx={{
                backgroundColor: 'green',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '3px',
                fontWeight: 'bold',
                fontSize: '10px',
                marginTop: '10px',
                display: 'inline-block',
              }}
            >
              Gratuito
            </Box>
          )}
        </Box>
      ))}
    </Slider>
  );
};

export default GoogleBooksCarousel;
