import { useState } from 'react';
import PropTypes from 'prop-types'; // Importe o PropTypes
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                senha,
            });

            console.log('Resposta do servidor:', response.data);

            if (response.data && response.data.message) {
                setSuccess(response.data.message);
                handleLogin(); // Atualiza o estado de autenticação
                navigate('/'); // Redireciona para a página principal após login
            }
        } catch (err) {
            console.log('Erro ao fazer login:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.error);
            } else {
                setError('Erro ao se conectar ao servidor. Tente novamente mais tarde.');
            }
        }
    };

    const handleGoogleLogin = () => {
        // Redireciona para a rota de autenticação do Google
        window.location.href = 'http://localhost:5000/auth/google';
    };
    
    return (
        <Container maxWidth="sm">
            <h2>Login de Usuário</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    label="Senha"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
                <Button variant="outlined" color="secondary" fullWidth onClick={handleGoogleLogin} style={{ marginTop: '10px' }}>
                    Login com Google
                </Button>
                <Button variant="text" color="primary" fullWidth onClick={() => navigate('/signup')} style={{ marginTop: '10px' }}>
                    Cadastrar
                </Button>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="success">{success}</Typography>}
            </form>
        </Container>
    );
};

// Adicione a definição de tipos para props com PropTypes
Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
};

export default Login;
