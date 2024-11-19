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

const GoogleBooksCarousel = () => {
  const [googleBooks, setGoogleBooks] = useState([]);

  useEffect(() => {
    fetch('https://www.googleapis.com/books/v1/volumes?q=popular')
      .then((response) => response.json())
      .then((data) => setGoogleBooks(data.items || []))
      .catch((error) => console.error('Error fetching Google Books:', error));
  }, []);

  return (
    <Slider {...sliderSettings}>
      {googleBooks.map((book) => (
        <Box key={book.id} sx={{ padding: '10px', textAlign: 'center' }}>
          <h3>{book.volumeInfo.title}</h3>
          {book.volumeInfo.imageLinks && (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              style={{ height: '200px', objectFit: 'contain', margin: '0 auto' }}
            />
          )}
        </Box>
      ))}
    </Slider>
  );
};

export default GoogleBooksCarousel;
