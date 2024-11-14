import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import BookList from '../../components/Books/BookList';
import { Typography, Container, Box, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import Slider from 'react-slick'; // Importa o Slider do react-slick
// src/App.js ou HomePage.js
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


// Estilos para o contêiner principal e seções
const MainContainer = styled(Container)({
  backgroundColor: '#1c0101',
  padding: '5px',
  borderRadius: '8px',
  marginTop: '5px',
  color: '#d2b48c',
  fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Section = styled(Box)({
  width: '100%',
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#30160f',
  borderRadius: '7px',
});

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '10px',
  backgroundColor: '#30160f',
  borderRadius: '8px',
  marginBottom: '20px',
});

const Title = styled(Typography)({
  color: '#d2b48c',
  fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
  fontSize: '24px',
  fontWeight: 'bold',
});

const SearchBar = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  padding: '2px 4px',
});

// Configurações do slider
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
        slidesToShow: 7,
        slidesToScroll: 7,
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

// Componente da página principal
const HomePage = () => {
  const [economyBooks, setEconomyBooks] = useState([]);
  const [selfHelpBooks, setSelfHelpBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [classicBooks, setClassicBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchBooksByCategory = async (query, setter) => {
      try {
        // Busca livros em espanhol
        const responseEs = await axios.get(`http://localhost:5000/api/books/search`, {
          params: {
            q: query,
            langRestrict: 'es', // Espanhol
          },
        });
    
        // Busca livros em inglês
        const responseEn = await axios.get(`http://localhost:5000/api/books/search`, {
          params: {
            q: query,
            langRestrict: 'en', // Inglês
          },
        });
    
        // Combina os resultados (limitando a quantidade se necessário)
        const combinedResults = [...responseEs.data, ...responseEn.data].slice(0, 16); // Limita a 16 livros, 8 de cada idioma
    
        setter(combinedResults); // Atualiza o estado com os resultados combinados
    
      } catch (error) {
        console.error(`Erro ao buscar livros para a categoria ${query}:`, error);
      }
    };
    

 
      fetchBooksByCategory('economia', setEconomyBooks);
      fetchBooksByCategory('autoayuda', setSelfHelpBooks); // autoajuda em espanhol para busca mais precisa
      fetchBooksByCategory('tendencias', setTrendingBooks);
      fetchBooksByCategory('clásicos', setClassicBooks);
      fetchBooksByCategory('mejor valorados', setTopRatedBooks);
    }, []);
    

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    try {
      const response = await axios.get(`http://localhost:5000/api/books/search?q=${searchQuery}`);
      setSearchResults(response.data.slice(0, 50)); // Limita os resultados da busca a 8 livros
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  return (
    <MainContainer>
      <Header>
        <Title>Book Recommendation</Title>
        <SearchBar>
          <TextField
            variant="standard"
            placeholder="Buscar livros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginRight: '8px' }}
          />
          <IconButton onClick={handleSearch} aria-label="buscar">
            <SearchIcon />
          </IconButton>
        </SearchBar>
      </Header>

      {searchResults.length > 0 && (
        <ShelfSection title="Resultados da Pesquisa" books={searchResults} />
      )}

      <ShelfSection title="Economia e Finanças" books={economyBooks} />
      <ShelfSection title="Desenvolvimento Pessoal" books={selfHelpBooks} />
      <ShelfSection title="Tendências do Momento" books={trendingBooks} />
      <ShelfSection title="Clássicos da Literatura" books={classicBooks} />
      <ShelfSection title="Melhores Avaliações" books={topRatedBooks} />
    </MainContainer>
  );
};

// Componente de cada seção da estante com carrossel
const ShelfSection = ({ title, books }) => (
  <Section>
    <Typography variant="h5" sx={{ color: '#f4f1de', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', fontFamily: 'cursive' }}>
      {title}
    </Typography>
    <Slider {...sliderSettings}>
      {books.map((book) => (
        <Box key={book.id} sx={{ padding: '10px' }}>
          <BookList books={[book]} />
        </Box>
      ))}
    </Slider>
  </Section>
);

ShelfSection.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      thumbnail: PropTypes.string,
    })
  ).isRequired,
};

export default HomePage;
