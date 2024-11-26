// src/components/Header/Header.jsx

import { AppBar, Toolbar, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Função para lidar com a busca de livros
    const handleSearch = async (e) => {
        e.preventDefault();

        // Verifica se a query de busca não está vazia
        if (searchQuery.trim()) {
            navigate(`/search-books?q=${searchQuery}`);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Meu Aplicativo
                </Typography>
                
                <form onSubmit={handleSearch} style={{ marginRight: '20px', display: 'flex' }}>
                    <TextField
                        label="Buscar livros"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <Button type="submit" variant="contained" color="secondary">
                        Buscar
                    </Button>
                </form>

                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
