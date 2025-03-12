// src/components/AuthSuccess.js

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthSuccess = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Captura o token da URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Armazena o token no localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('isAuthenticated', 'true');

            // Atualiza o estado de autenticação no App
            setIsAuthenticated(true);

            // Redireciona para a página inicial ou outra página protegida
            navigate('/');
        } else {
            // Se não houver token na URL, redireciona para a página de login
            navigate('/login');
        }
    }, [location, navigate, setIsAuthenticated]); // A dependência de setIsAuthenticated pode causar problema de loop se for alterada no meio

    return null; // Este componente não precisa renderizar nada
};

AuthSuccess.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default AuthSuccess;
