import GoogleBooksCarousel from '../../components/Books/GoogleBooks/GoogleBooksCarousel';
import OpenLibraryCarousel from '../../components/Books/GoogleBooks/OpenLibraryCarousel';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Estilos principais para organizar os carrosséis
const MainContainer = styled(Container)({
  backgroundColor: '#1c0101',
  padding: '10px', // Reduzi o padding para mobile
  borderRadius: '8px',
  color: '#d2b48c',
  fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100vw', // Garante que não ultrapasse a largura da tela
  overflowX: 'hidden',
});



const Section = styled(Box)({
  marginBottom: '20px', // Reduzindo a margem para evitar espaços extras
  textAlign: 'center',
  width: '100%', // Para garantir que o conteúdo fique centralizado corretamente
});


const Title = styled(Typography)({
  fontSize: '20px', // Reduzido para melhor encaixe em mobile
  fontWeight: 'bold',
  marginBottom: '15px',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '16px', // Ainda menor para telas menores
  },
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