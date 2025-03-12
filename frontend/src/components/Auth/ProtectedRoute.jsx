// src/components/Auth/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        console.log('Usuário não autenticado, redirecionando para a página inicial...');
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