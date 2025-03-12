import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedAdminRoute = ({ children }) => {
    const role = localStorage.getItem("role");


    if (role !== "admin") {
        console.log("Usuário não é admin, redirecionando para a home...");
        return <Navigate to="/" replace />;
    }

    return children;
};

ProtectedAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedAdminRoute;