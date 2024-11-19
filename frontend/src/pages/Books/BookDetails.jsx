import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const BookDetails = () => {
  const { id } = useParams(); // Obtém o ID do livro da URL

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Detalhes do Livro
      </Typography>
      <Typography variant="h6">
        ID do Livro: {id}
      </Typography>
    </Box>
  );
};

export default BookDetails;
