
import PropTypes from 'prop-types'; // Importar PropTypes
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{ margin: '20px' }}>
                {children}
            </main>
        </>
    );
};

// Adicionando validação de PropTypes
Layout.propTypes = {
    children: PropTypes.node, // 'children' pode ser qualquer nó React (elementos, strings, etc.)
};

export default Layout;
