import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children, isAuthenticated }) => {
    const location = useLocation();

    if (!isAuthenticated) {
        console.log("Usuário não autenticado, redirecionando para login...");
        return <Navigate to="/login" />;
    }

    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwt_decode(token);
            console.log("Usuário autenticado:", decoded);

            if (location.pathname === "/admin" && decoded.role !== "admin") {
                console.log("Acesso negado: usuário não é admin.");
                return <Navigate to="/" />;
            }
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            return <Navigate to="/" />;
        }
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

export default ProtectedRoute;
