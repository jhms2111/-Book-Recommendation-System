import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const sliderSettings = {
  dots: true,
  infinite: false, // Mantiene el orden de los libros
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
      settings: { slidesToShow: 3, slidesToScroll: 3 }, // Muestra 3 libros por línea en pantallas más pequeñas
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false, // Elimina los botones en el móvil para una mejor experiencia de usuario
        centerMode: false,
        variableWidth: false,
        rows: 2, // Organiza los libros en 2 filas en el móvil
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
        console.error('Error al buscar libros de Google Books:', error);
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
          Cargando libros de Google Books...
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
          No se encontraron libros.
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
          {/* Agregando Tooltip para mostrar el nombre del libro */}
          <Tooltip title={book.volumeInfo?.title || 'Título no disponible'} placement="top">
            <Box>
              {/* Portada del Libro */}
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
                  Portada no disponible
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* Sello de Gratuito */}
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
              Gratis
            </Box>
          )}
        </Box>
      ))}
    </Slider>
  );
};

export default GoogleBooksCarousel;
