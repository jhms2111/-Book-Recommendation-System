import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (isAuthenticated === null) {
        return null; // Espera a validação antes de decidir o redirecionamento
    }

    if (!isAuthenticated) {
        console.log("Usuário não autenticado, redirecionando para login...");
        return <Navigate to="/login" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool, // Agora opcional
};

export default ProtectedRoute;
