import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && !redirecting) {
            console.log('Usuário não autenticado, redirecionando para login...');
            setRedirecting(true);
        }
    }, [isAuthenticated, redirecting]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    console.log('Usuário autenticado, permitindo acesso à rota.');
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool, // Agora é opcional
};

export default ProtectedRoute;
