import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Decodifica o token JWT
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando o payload
            console.log(decodedToken); // Verifique o conteúdo do decodedToken no console

            // Verificar se 'name' ou 'nome' existe no token e atribuir ao estado
            if (decodedToken.name) {
                setUserName(decodedToken.name); // Se 'name' estiver presente
            } else if (decodedToken.nome) {
                setUserName(decodedToken.nome); // Se 'nome' estiver presente
            }

            setUserEmail(decodedToken.email); // Atribui o email ao estado
        }
    }, []);

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
                    {userName && ` - Bem-vindo, ${userName}!`}  {/* Exibe o nome do usuário */}
                    {userEmail && ` (Email: ${userEmail})`}  {/* Exibe o email do usuário */}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
