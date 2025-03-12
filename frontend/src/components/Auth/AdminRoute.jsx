import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Importa PropTypes

const AdminRoute = ({ isAuthenticated, user, children }) => {
    // Verifica se o usuário está autenticado e se é admin
    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" />; // Redireciona para a Home se não for admin
    }
    return children;
};

// ✅ Adicionando validação das props para evitar warnings do ESLint
AdminRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape({
        role: PropTypes.string, // Valida que role é uma string
    }),
    children: PropTypes.node.isRequired,
};

export default AdminRoute;
