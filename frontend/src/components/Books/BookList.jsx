import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import './BookList.css';

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3, // 3 colunas visíveis
  slidesToScroll: 3,
  rows: 2, // Duas linhas de livros ao mesmo tempo
  arrows: false,
  centerMode: false,
  variableWidth: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        rows: 2, 
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        rows: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        rows: 2,
      },
    },
  ],
};

const BookList = ({ books }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true); // Força uma atualização para corrigir o erro no modo mobile do DevTools
  }, []);

  const handleBookClick = (book) => {
    const bookId = book.id || book.key?.replace('/works/', '');
    if (bookId) {
      navigate(`/book-review/${bookId}`);
    }
  };

  const renderBookItem = (book) => (
    <Box
      key={book.id || book.key}
      sx={{
        textAlign: 'center',
        cursor: 'pointer',
        padding: '10px',
        zIndex: 10,
        position: 'relative',
      }}
      onClick={() => handleBookClick(book)}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          padding: '5px',
          borderRadius: '5px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '120px',
          height: '180px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <img
          src={
            book.volumeInfo?.imageLinks?.thumbnail ||
            (book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : 'https://via.placeholder.com/120x180.png?text=Sem+Capa')
          }
          alt={book.title || 'Título Desconhecido'}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '5px',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 30,
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: '#fff',
          marginTop: '5px',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          position: 'relative',
          zIndex: 20,
        }}
      >
        {book.title || 'Título Indisponível'}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: '#1c0101',
        padding: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {isRendered && books.length > 0 ? (
        isMobile ? (
          <Slider {...sliderSettings}>
            {books.map((book) => renderBookItem(book))}
          </Slider>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            {books.map((book) => renderBookItem(book))}
          </Box>
        )
      ) : (
        <Typography variant="h6" color="white" textAlign="center">
          Nenhum livro encontrado
        </Typography>
      )}
    </Box>
  );
};

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      title: PropTypes.string,
      thumbnail: PropTypes.string,
      cover_i: PropTypes.number,
    })
  ).isRequired,
};

export default BookList;
