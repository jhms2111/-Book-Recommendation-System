import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando el JWT
            setUserName(decodedToken.name);
            setUserEmail(decodedToken.email);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
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
                        BRS {userName && ` - ${userName}`} {userEmail && ` (${userEmail})`} 
                    </Typography>
                    
                    {/* Ícono de menú para móviles */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton edge="end" color="inherit" onClick={toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Botones de navegación para escritorio */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button color="inherit" onClick={() => navigate('/')}>Inicio</Button>
                        <Button color="inherit" onClick={() => navigate('/search-books')}>Buscar Libros</Button>
                        <Button color="inherit" onClick={() => navigate('/my-books')}>Mis Libros</Button>
                        <Button color="inherit" onClick={() => navigate('/Ranking')}>Ranking</Button>
                        <Button color="inherit" onClick={() => navigate('/comentarios')}>Comentarios</Button>
                        <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menú desplegable cubriendo toda la pantalla en móvil */}
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
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/'); toggleMenu(); }}>
                        Inicio
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/search-books'); toggleMenu(); }}>
                        Buscar Libros
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/my-books'); toggleMenu(); }}>
                        Mis Libros
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/ranking'); toggleMenu(); }}>
                        Ranking
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/comentarios'); toggleMenu(); }}>
                        Comentarios
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: 'red' 
                    }} onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Box>
            )}
        </>
    );
};

export default Header;
