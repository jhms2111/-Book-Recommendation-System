import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Definição de sliderSettings
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

const CookingBooksOpenLibraryCarousel = () => {
  const [openLibraryBooks, setOpenLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://openlibrary.org/search.json?q=cooking');
        const data = await response.json();
        setOpenLibraryBooks(data.docs || []);
      } catch (error) {
        console.error('Error al buscar libros de Culinária:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress size={60} sx={{ color: '#007BFF', marginBottom: '20px' }} />
        <Typography variant="h6" color="textSecondary">Cargando libros de Culinária...</Typography>
      </Box>
    );
  }

  return (
    <Slider {...sliderSettings}>
      {openLibraryBooks.map((book) => (
        <Tooltip key={book.key} title={book.title} placement="top">
          <Box sx={{ padding: '10px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(`/book-review/${book.key.replace('/works/', '')}`)}>
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                style={{ height: '150px', width: '100px', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ height: '150px', width: '100px', backgroundColor: '#f0f0f0' }}>Portada no disponible</Box>
            )}
          </Box>
        </Tooltip>
      ))}
    </Slider>
  );
};

export default CookingBooksOpenLibraryCarousel;
