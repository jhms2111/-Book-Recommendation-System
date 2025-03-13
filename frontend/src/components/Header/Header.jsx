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
        const storedRole = localStorage.getItem('role'); // Asegúrate de que el rol se guarda en el localStorage
        
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
            setUserName(decodedToken.name);
            setUserEmail(decodedToken.email);
            setUserRole(storedRole); // Lee el rol directamente del localStorage
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role'); // 🔥 Elimina el rol al hacer logout
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
                    
                    {/* Ícono de menú para dispositivos móviles */}
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
                        <Button color="inherit" onClick={() => navigate('/ranking')}>Ranking</Button>
                        <Button color="inherit" onClick={() => navigate('/reseñas')}>Reseñas</Button>

                        {/* Botón de Admin aparece solo si el rol es "admin" */}
                        {userRole === 'admin' && (
                            <Button color="secondary" variant="outlined" onClick={() => navigate('/admin/admin')}>
                                Admin
                            </Button>
                        )}

                        <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menú lateral para dispositivos móviles */}
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
                        Inicio
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/search-books'); toggleMenu(); }}>
                        Buscar Libros
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/my-books'); toggleMenu(); }}>
                        Mis Libros
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/ranking'); toggleMenu(); }}>
                        Ranking
                    </Button>
                    <Button sx={menuButtonStyle} onClick={() => { navigate('/reseñas'); toggleMenu(); }}>
                        Reseñas
                    </Button>

                    {/* Botón de Admin en el menú móvil */}
                    {userRole === 'admin' && (
                        <Button sx={{ ...menuButtonStyle, color: 'red' }} onClick={() => { navigate('/admin/admin'); toggleMenu(); }}>
                            Admin
                        </Button>
                    )}

                    <Button sx={{ ...menuButtonStyle, color: 'red' }} onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                </Box>
            )}
        </>
    );
};

// Estilos del menú móvil
const menuButtonStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily: '"Cinzel", serif',
    color: '#1c0101'
};

export default Header;
