import GoogleBooksCarousel from '../../components/Books/GoogleBooks/GoogleBooksCarousel';
import OpenLibraryCarousel from '../../components/Books/GoogleBooks/OpenLibraryCarousel';
import EconomyBooksCarousel from '../../components/Books/GoogleBooks/EconomyBooksCarousel';
import HealthBooksCarousel from '../../components/Books/GoogleBooks/HealthBooksCarousel';
import RomanceBooksCarousel from '../../components/Books/GoogleBooks/RomanceBooksCarousel';
import TechnologyBooksGoogleCarousel from '../../components/Books/GoogleBooks/TechnologyBooksGoogleCarousel';
import PhilosophyBooksGoogleCarousel from '../../components/Books/GoogleBooks/PhilosophyBooksGoogleCarousel';
import HistoryBooksOpenLibraryCarousel from '../../components/Books/GoogleBooks/HistoryBooksOpenLibraryCarousel';
import CookingBooksOpenLibraryCarousel from '../../components/Books/GoogleBooks/CookingBooksOpenLibraryCarousel';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Estilos principales para organizar los carruseles
const MainContainer = styled(Container)({
  backgroundColor: '#1c0101',
  padding: '10px', // Reducido el padding para móviles
  borderRadius: '8px',
  color: '#d2b48c',
  fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100vw', // Asegura que no supere el ancho de la pantalla
  overflowX: 'hidden',
  marginTop: '50px', // Espacio extra para separarlo del encabezado
  '@media (max-width: 600px)': {
    marginTop: '50px', // Más espacio en móviles
  },
});

const Section = styled(Box)({
  marginBottom: '20px', // Reduciendo el margen para evitar espacios extra
  textAlign: 'center',
  width: '100%', // Para asegurar que el contenido se centre correctamente
});

const Title = styled(Typography)({
  fontSize: '20px', // Reducido para mejor ajuste en móviles
  fontWeight: 'bold',
  marginBottom: '15px',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '16px', // Aún más pequeño para pantallas más pequeñas
  },
});

const HomePage = () => {
  return (
    <MainContainer>
      <Section>
        <Title>Populares</Title>
        <GoogleBooksCarousel />
      </Section>
      <Section>
        <Title>Gratis</Title>
        <OpenLibraryCarousel />
      </Section>
      <Section>
        <Title>Economía</Title>
        <EconomyBooksCarousel />
      </Section>
      <Section>
        <Title>Salud</Title>
        <HealthBooksCarousel />
      </Section>
      <Section>
        <Title>Romántico</Title>
        <RomanceBooksCarousel />
      </Section>
      <Section>
        <Title>Tecnología</Title>
        <TechnologyBooksGoogleCarousel />
      </Section>
      <Section>
        <Title>Filosofía</Title>
        <PhilosophyBooksGoogleCarousel />
      </Section>
      <Section>
        <Title>Historia</Title>
        <HistoryBooksOpenLibraryCarousel />
      </Section>
      <Section>
        <Title>Cocina</Title>
        <CookingBooksOpenLibraryCarousel />
      </Section>
    </MainContainer>
  );
};

export default HomePage;
