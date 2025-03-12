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
            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);

            setTimeout(() => {
                navigate('/', { replace: true }); // 🔥 Espera um pequeno delay para garantir que o estado foi atualizado
            }, 100);
        } else {
            navigate('/login', { replace: true });
        }
    }, []);

    return null;
};

AuthSuccess.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default AuthSuccess;
