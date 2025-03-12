import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedAdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("role");

    if (!isAuthenticated) {
        console.log("Usuário não autenticado, redirecionando para login...");
        return <Navigate to="/login" />;
    }

    if (role !== "admin") {
        console.log("Usuário não é admin, redirecionando para a home...");
        return <Navigate to="/" />;
    }

    return children;
};

ProtectedAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedAdminRoute;
