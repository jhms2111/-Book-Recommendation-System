import { useEffect } from 'react';
import GoogleBooksCarousel from '../../components/Books/GoogleBooks/GoogleBooksCarousel';
import OpenLibraryCarousel from '../../components/Books/GoogleBooks/OpenLibraryCarousel';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Garante que não há margem no container principal
const MainContainer = styled(Container)({
  backgroundColor: '#1c0101',
  padding: '0',
  margin: '0', // Remove qualquer margem
  color: '#d2b48c',
  fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  boxSizing: 'border-box',
  overflow: 'hidden',
});

const Section = styled(Box)({
  textAlign: 'center',
  width: '100%',
  maxWidth: '1200px',
});

const Title = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '15px',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '18px',
  },
});

const HomePage = () => {
  // Garante que <main> tenha margin: 0px SEMPRE
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.margin = '0px'; // Remove qualquer margem inline
      mainElement.style.padding = '0px'; // Remove qualquer padding inline
    }
  }, []);

  return (
    <MainContainer disableGutters>
      <Section>
        <Title>Google Books</Title>
        <GoogleBooksCarousel />
      </Section>
      <Section>
        <Title>Open Library Books</Title>
        <OpenLibraryCarousel />
      </Section>
    </MainContainer>
  );
};

export default HomePage;