import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, isAuthenticated, checkAuth }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth(); // Verifica a autenticação antes de tomar qualquer decisão
            setLoading(false);
        };
        verifyAuth();
    }, [checkAuth]);

    if (loading) {
        return <p>Carregando...</p>; // Evita redirecionamento prematuro
    }

    if (!isAuthenticated) {
        console.log('Usuário não autenticado, redirecionando para login...');
        return <Navigate to="/login" />;
    }

    console.log('Usuário autenticado, permitindo acesso à rota.');
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    checkAuth: PropTypes.func.isRequired,
};

export default ProtectedRoute;
