import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica o JWT
            setUserName(decodedToken.name);
            setUserEmail(decodedToken.email);
            setUserRole(decodedToken.role); // 🔥 Armazena a role do usuário
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role'); // 🔥 Remove a role ao fazer logout
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: '#1c0101' }}>
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            flexGrow: 1, 
                            fontSize: '1rem', 
                            cursor: 'pointer', 
                            fontFamily: '"Cinzel", serif', 
                            fontWeight: 'bold' 
                        }} 
                        onClick={() => navigate('/')}
                    > 
                        BookTrove {userName && ` - ${userName}`} {userEmail && ` (${userEmail})`} 
                    </Typography>
                    
                    {/* Ícone de menu para dispositivos móveis */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton edge="end" color="inherit" onClick={toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Botões de navegação para desktop */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button color="inherit" onClick={() => navigate('/')}>Início</Button>
                        <Button color="inherit" onClick={() => navigate('/search-books')}>Buscar Livros</Button>
                        <Button color="inherit" onClick={() => navigate('/my-books')}>Meus Livros</Button>
                        <Button color="inherit" onClick={() => navigate('/ranking')}>Ranking</Button>
                        <Button color="inherit" onClick={() => navigate('/comentarios')}>Comentários</Button>

                        {/* 🔥 Botão de Admin aparece apenas se a role for "admin" */}
                        {userRole === 'admin' && (
                            <Button color="secondary" variant="outlined" onClick={() => navigate('/admin')}>
                                Admin
                            </Button>
                        )}

                        <Button color="inherit" onClick={handleLogout}>Sair</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menu lateral para dispositivos móveis */}
            {menuOpen && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 50,
                }}>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/'); toggleMenu(); }}>
                        Início
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/search-books'); toggleMenu(); }}>
                        Buscar Livros
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/my-books'); toggleMenu(); }}>
                        Meus Livros
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/ranking'); toggleMenu(); }}>
                        Ranking
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/comentarios'); toggleMenu(); }}>
                        Comentários
                    </Button>

                    {/* 🔥 Botão de Admin no menu mobile */}
                    {userRole === 'admin' && (
                        <Button sx={{ ...menuButtonStyle, color: 'red' }} onClick={() => { navigate('/admin'); toggleMenu(); }}>
                            Admin
                        </Button>
                    )}

                    <Button sx={{ ...menuButtonStyle, color: 'red' }} onClick={handleLogout}>
                        Sair
                    </Button>
                </Box>
            )}
        </>
    );
};

// Estilos do menu mobile
const menuButtonStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily: '"Cinzel", serif',
    color: '#1c0101'
};

export default Header;
