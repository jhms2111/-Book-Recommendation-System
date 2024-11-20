import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';

const CreateBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/book-pages', {
        bookId,
        content,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Token do usuário
        },
      });

      alert(response.data.message);
      navigate('/my-pages'); // Redireciona para a lista de páginas criadas
    } catch (error) {
      console.error('Erro ao salvar a página:', error);
      alert('Erro ao salvar a página');
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Criar Página para o Livro
      </Typography>
      <Typography variant="h6" gutterBottom>
        ID do Livro: {bookId}
      </Typography>
      <TextField
        label="Conteúdo Personalizado"
        multiline
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Salvar Página
      </Button>
    </Box>
  );
};

export default CreateBookPage;
