import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Typography, CircularProgress } from '@mui/material';
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

const OpenLibraryCarousel = () => {
  const [openLibraryBooks, setOpenLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://openlibrary.org/search.json?q=bestsellers');
        const data = await response.json();

        // Filtrar livros com domínio público, gratuitos e em espanhol
        const filteredBooks = data.docs.filter((book) => {
          const isPublicDomain = book.public_scan_b === true; // Verifica domínio público
          const isFree = !!book.lending_edition_s || !!book.ia; // Verifica disponibilidade gratuita
          const isSpanish = book.language?.includes('spa'); // Verifica se está em espanhol
          return isPublicDomain && isFree && isSpanish;
        });

        setOpenLibraryBooks(filteredBooks);
      } catch (error) {
        console.error('Erro ao buscar livros do Open Library:', error);
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
        <CircularProgress
          size={60}
          sx={{ color: '#007BFF', marginBottom: '20px' }}
        />
        <Typography variant="h6" color="textSecondary">
          Carregando livros gratuitos, de domínio público e em espanhol...
        </Typography>
      </Box>
    );
  }

  if (openLibraryBooks.length === 0) {
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
          Nenhum livro encontrado com os critérios especificados.
        </Typography>
      </Box>
    );
  }

  return (
    <Slider {...sliderSettings}>
      {openLibraryBooks.map((book) => (
        <Box
          key={book.key}
          sx={{
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => navigate(`/book-review/${book.key.replace('/works/', '')}`)}
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
            {book.title}
          </Typography>

          {/* Capa do Livro Padronizada */}
          {book.cover_i ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={book.title}
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
            {/* Selo de Dominio Público */}
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
          </Box>
        </Box>
      ))}
    </Slider>
  );
};

export default OpenLibraryCarousel;
