import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const AdminRoute = ({ isAuthenticated, userRole, children }) => {
    if (!isAuthenticated || userRole !== "admin") {
        return <Navigate to="/" />;
    }
    return children;
};

// 🔹 Validação das props com PropTypes
AdminRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default AdminRoute;
