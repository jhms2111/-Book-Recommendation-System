import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const sliderSettings = {
  dots: true,
  infinite: false,
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
      settings: { slidesToShow: 3, slidesToScroll: 3 },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false,
        centerMode: false,
        variableWidth: false,
        rows: 2,
      },
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

        const filteredBooks = data.docs.filter((book) => {
          const isPublicDomain = book.public_scan_b === true;
          const isFree = !!book.lending_edition_s || !!book.ia;
          const isSpanish = book.language?.includes('spa');
          return isPublicDomain && isFree && isSpanish;
        });

        setOpenLibraryBooks(filteredBooks);
      } catch (error) {
        console.error('Error al buscar libros de Open Library:', error);
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#007BFF', marginBottom: '20px' }} />
        <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
          Cargando libros gratuitos, de dominio público y en español...
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
          No se encontraron libros con los criterios especificados.
        </Typography>
      </Box>
    );
  }

  return (
    <Slider {...sliderSettings}>
      {openLibraryBooks.map((book) => (
        <Tooltip key={book.key} title={book.title} placement="top">
          <Box
            sx={{
              padding: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => navigate(`/book-review/${book.key.replace('/works/', '')}`)}
          >
            {/* Portada del Libro */}
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
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
                Portada no disponible
              </Box>
            )}

            {/* Sellos de Identificación */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '5px',
              }}
            >
              {/* Sello de Gratuito */}
              <Box
                sx={{
                  backgroundColor: 'green',
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  marginBottom: '2px',
                }}
              >
                Gratis
              </Box>

              {/* Sello de Dominio Público */}
              <Box
                sx={{
                  backgroundColor: 'blue',
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}
              >
                Dominio Público
              </Box>
            </Box>
          </Box>
        </Tooltip>
      ))}
    </Slider>
  );
};

export default OpenLibraryCarousel;
