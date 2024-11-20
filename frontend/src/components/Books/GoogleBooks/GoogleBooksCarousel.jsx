import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 4, slidesToScroll: 4 },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 2, slidesToScroll: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1, slidesToScroll: 1 },
    },
  ],
};

const GoogleBooksCarousel = () => {
  const [googleBooks, setGoogleBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=popular');
        const data = await response.json();

        // Atualiza o estado com os livros obtidos
        setGoogleBooks(data.items || []);
      } catch (error) {
        console.error('Erro ao buscar livros do Google Books:', error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Carregando livros populares...
        </Typography>
      </Box>
    );
  }

  if (googleBooks.length === 0) {
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
      {googleBooks.map((book) => (
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
          {/* Nome do Livro em letras menores */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '10px', // Reduzido para cerca de 60%
              color: '#555',
            }}
          >
            {book.volumeInfo?.title || 'Título indisponível'}
          </Typography>

          {/* Capa do Livro Padronizada */}
          {book.volumeInfo?.imageLinks?.thumbnail ? (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo?.title}
              style={{
                height: '150px', // Altura padronizada
                width: '100px', // Largura padronizada
                objectFit: 'cover',
                margin: '0 auto',
                display: 'block',
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
              }}
            >
              Capa não disponível
            </Box>
          )}

          {/* Selos Abaixo da Capa */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '5px',
            }}
          >
            {/* Selo de Gratuito */}
            {book.saleInfo?.isEbook && book.saleInfo?.listPrice?.amount === 0 && (
              <Box
                sx={{
                  backgroundColor: 'green',
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  fontSize: '10px', // Reduzido para ser discreto
                  marginBottom: '2px',
                }}
              >
                Gratuito
              </Box>
            )}
            {/* Selo de Dominio Público */}
            {book.accessInfo?.publicDomain && (
              <Box
                sx={{
                  backgroundColor: 'blue',
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  fontSize: '10px', // Reduzido para ser discreto
                }}
              >
                Dominio Público
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Slider>
  );
};

export default GoogleBooksCarousel;
