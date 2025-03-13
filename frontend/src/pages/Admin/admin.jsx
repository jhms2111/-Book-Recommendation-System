import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f4f6f8', // Cor de fundo suave
            }}
        >
            <Typography 
                variant="h4" 
                sx={{
                    fontWeight: 'bold', 
                    marginBottom: '2rem', 
                    fontFamily: '"Cinzel", serif',
                    color: '#1c0101'
                }}
            >
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Botão para usuários */}
                <Button
                    variant="contained"
                    sx={{
                        width: '200px',
                        padding: '1rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        backgroundColor: '#1c75bc', // Azul moderno
                        '&:hover': {
                            backgroundColor: '#155d8c', // Tom de azul mais escuro no hover
                        },
                        color: 'white',
                        borderRadius: '8px',
                    }}
                    onClick={() => navigate('/admin/usersadmin')}
                >
                    Usuarios
                </Button>

                {/* Botão para postagens */}
                <Button
                    variant="contained"
                    sx={{
                        width: '200px',
                        padding: '1rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        backgroundColor: '#1c75bc', // Azul moderno
                        '&:hover': {
                            backgroundColor: '#155d8c', // Tom de azul mais escuro no hover
                        },
                        color: 'white',
                        borderRadius: '8px',
                    }}
                    onClick={() => navigate('/admin/comentariosadmin')}
                >
                    Reseñas
                </Button>
            </Box>
        </Box>
    );
};

export default Admin;
