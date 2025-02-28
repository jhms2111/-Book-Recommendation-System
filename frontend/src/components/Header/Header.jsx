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
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando o JWT
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
                    
                    {/* Ícone de menu para mobile */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton edge="end" color="inherit" onClick={toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Botões de navegação para desktop */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
                        <Button color="inherit" onClick={() => navigate('/search-books')}>Buscar Livros</Button>
                        <Button color="inherit" onClick={() => navigate('/my-books')}>Meus Livros</Button>
                        <Button color="inherit" onClick={() => navigate('/postar')}>Postar</Button>
                        <Button color="inherit" onClick={() => navigate('/feed')}>Feed</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menu suspenso cobrindo a tela toda no mobile */}
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
                        Home
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/search-books'); toggleMenu(); }}>
                        Buscar Livros
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/my-books'); toggleMenu(); }}>
                        Meus Livros
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/postar'); toggleMenu(); }}>
                        Postar
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: '#1c0101' 
                    }} onClick={() => { navigate('/feed'); toggleMenu(); }}>
                        Feed
                    </Button>
                    <Button sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        fontFamily: '"Cinzel", serif', 
                        color: 'red' 
                    }} onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            )}
        </>
    );
};

export default Header;
