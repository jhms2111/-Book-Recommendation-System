// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignupPage from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthSuccess from './components/Auth/AuthSuccess';
import BookSearchPage from './pages/Books/BookSearchPage';
import BookDetailsPage from './pages/Books/BookDetailsPage';
import HomePage from './pages/Home/HomePage'; // Importa o componente HomePage

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Inicialmente null

    useEffect(() => {
        const token = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(token === 'true');
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    if (isAuthenticated === null) {
        // Renderiza um indicador de carregamento enquanto o estado é carregado
        return <div>Carregando...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} />
                
                {/* Rota principal "/" usando o componente HomePage dentro de uma ProtectedRoute */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <HomePage handleLogout={handleLogout} />
                        </ProtectedRoute>
                    } 
                />

                <Route path="/auth/success" element={<AuthSuccess setIsAuthenticated={setIsAuthenticated} />} />
                
                {/* Outras rotas protegidas */}
                <Route 
                    path="/search-books" 
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <BookSearchPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/book/:bookId" 
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <BookDetailsPage />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
