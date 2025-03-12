import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthSuccess = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('isAuthenticated', 'true');

            setIsAuthenticated(true);
            setLoading(false);

            navigate('/');
        } else {
            navigate('/login');
        }
    }, [location, navigate, setIsAuthenticated]);

    if (loading) {
        return <p>Carregando autenticação...</p>;
    }

    return null;
};

AuthSuccess.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default AuthSuccess;
