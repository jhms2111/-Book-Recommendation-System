import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        console.log("Usuário não autenticado, redirecionando para login...");
        return <Navigate to="/login" />;
    }

    // Verifica se o usuário tem permissão de admin
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwt_decode(token);
            console.log("Usuário autenticado:", decoded);

            if (window.location.pathname === "/admin" && decoded.role !== "admin") {
                console.log("Acesso negado: usuário não é admin.");
                return <Navigate to="/" />;
            }
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            return <Navigate to="/" />; // Redireciona para home se o token for inválido
        }
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool, // Agora é opcional
};

export default ProtectedRoute;
