import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box } from '@mui/material';

// Configurações do carrossel
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

  useEffect(() => {
    fetch('https://openlibrary.org/search.json?q=bestsellers')
      .then((response) => response.json())
      .then((data) => setOpenLibraryBooks(data.docs || []))
      .catch((error) => console.error('Error fetching Open Library Books:', error));
  }, []);

  return (
    <Slider {...sliderSettings}>
      {openLibraryBooks.map((book) => (
        <Box key={book.key} sx={{ padding: '10px', textAlign: 'center' }}>
          <h3>{book.title}</h3>
          {book.cover_i && (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={book.title}
              style={{ height: '200px', objectFit: 'contain', margin: '0 auto' }}
            />
          )}
        </Box>
      ))}
    </Slider>
  );
};

export default OpenLibraryCarousel;
