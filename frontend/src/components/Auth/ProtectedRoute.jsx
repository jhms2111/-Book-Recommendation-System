import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && !hasRedirected) {
            setHasRedirected(true); // Marca que já houve redirecionamento
        }
    }, [isAuthenticated, hasRedirected]);

    if (!isAuthenticated && !hasRedirected) {
        console.log('Usuário não autenticado, redirecionando para login...');
        return <Navigate to="/" replace />;
    }

    console.log('Usuário autenticado, permitindo acesso à rota.');
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool, // Agora é opcional
};

export default ProtectedRoute;
