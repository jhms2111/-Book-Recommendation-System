import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthSuccess = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);

            // 🔥 Usa replace: true para evitar ciclos de navegação
            navigate('/', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, []); // 🔥 Remove dependências para evitar múltiplas execuções

    return null;
};

AuthSuccess.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default AuthSuccess;
