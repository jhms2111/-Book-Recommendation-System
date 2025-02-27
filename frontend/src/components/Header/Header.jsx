import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando o JWT
            setUserName(decodedToken.name); // Armazenando o nome do usuário
            setUserEmail(decodedToken.email); // Armazenando o email do usuário
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#1c0101' }}> {/* Altere para a cor desejada */}
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}> 
                    Meu Aplicativo {userName && ` - ${userName}`} {userEmail && ` (${userEmail})`} 
                </Typography>
                
                {/* Ícone de menu para mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </IconButton>
                </Box>
                
                {/* Menu de navegação para mobile */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>Home</MenuItem>
                    <MenuItem onClick={() => { navigate('/search-books'); handleMenuClose(); }}>Buscar Livros</MenuItem>
                    <MenuItem onClick={() => { navigate('/my-books'); handleMenuClose(); }}>Meus Livros</MenuItem>
                    <MenuItem onClick={() => { navigate('/postar'); handleMenuClose(); }}>Postar</MenuItem>
                    <MenuItem onClick={() => { navigate('/feed'); handleMenuClose(); }}>Feed</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>

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
    );
};

export default Header;
