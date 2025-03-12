import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ isAuthenticated, userRole, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (userRole !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

AdminRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default AdminRoute;
