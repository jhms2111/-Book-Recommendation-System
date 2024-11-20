
import { Box, Typography, CircularProgress } from '@mui/material';

const LoadingBooks = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      <CircularProgress
        size={80}
        sx={{
          color: '#007BFF',
          marginBottom: '20px',
        }}
      />
      <Typography
        variant="h5"
        sx={{
          color: '#333',
          animation: 'pulse 2s infinite',
        }}
      >
        Cargando libros gratuitos...
      </Typography>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingBooks;
