import GoogleBooksCarousel from '../../components/Books/GoogleBooks/GoogleBooksCarousel';
import OpenLibraryCarousel from '../../components/Books/GoogleBooks/OpenLibraryCarousel';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Estilos principais para organizar os carrosséis
const MainContainer = styled(Container)({
  backgroundColor: '#1c0101',
  padding: '20px',
  borderRadius: '8px',
  color: '#d2b48c',
  fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
});

const Section = styled(Box)({
  marginBottom: '40px',
  textAlign: 'center',
});

const Title = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
});

const HomePage = () => {
  return (
    <MainContainer>
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
