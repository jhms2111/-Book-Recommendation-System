import { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import Slider from 'react-slick';
import SearchIcon from '@mui/icons-material/Search';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GoogleBooksCarousel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [googleBooks, setGoogleBooks] = useState([]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 7,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    try {
      // Requisição ao backend que faz a busca na API do Google Books
      const response = await axios.get(`http://localhost:5000/api/google-books/search?q=${searchQuery}`);
      console.log(response.data); // Verifique o conteúdo da resposta no console
//
      // Certifique-se de que estamos acessando a propriedade "items" na resposta
      setGoogleBooks(response.data.items || []);  // Atualiza o estado com os livros encontrados
    } catch (error) {
      console.error('Erro ao buscar livros na API do Google Books:', error);
    }
  };
//
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', color: '#fff' }}>
        Google Books - Carrossel de Livros
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          variant="standard"
          placeholder="Buscar livros no Google Books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginRight: '8px' }}
        />
        <IconButton onClick={handleSearch} aria-label="buscar">
          <SearchIcon />
        </IconButton>
      </Box>

      <Slider {...sliderSettings}>
        {googleBooks.length > 0 ? (
          googleBooks.map((book) => (
            <Box key={book.id} sx={{ padding: '10px' }}>
              {/* Verifique se a imagem está disponível antes de renderizar */}
              <img
                src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}  // Fallback para imagem padrão
                alt={book.volumeInfo.title}
                style={{ width: '100px', height: '150px', objectFit: 'cover' }}
              />
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#fff' }}>
                {book.volumeInfo.title}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#fff' }}>
            Nenhum livro encontrado.
          </Typography>
        )}
      </Slider>
    </Box>
  );
};

export default GoogleBooksCarousel;
