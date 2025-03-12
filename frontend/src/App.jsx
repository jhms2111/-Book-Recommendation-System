import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignupPage from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthSuccess from './components/Auth/AuthSuccess';
import BookSearchPage from './pages/Books/BookSearchPage';
import BookDetailsPage from './pages/Books/BookDetailsPage';
import HomePage from './pages/Home/HomePage';
import BookReviewPage from './pages/Books/BookReviewPage';
import UserBooksPage from './pages/Books/UserBooksPage';
import RankingPage from './pages/Ranking/RankingPage';
import Feed from './components/Feed/Feed';
import AdminPage from './components/Admin/AdminPage';
import Layout from './components/Header/Layout';
import axios from 'axios'; // Importe axios para fazer requisições HTTP
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado para verificar se o usuário está autenticado
    const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Faz uma requisição para verificar os dados do usuário
                    const response = await axios.get('https://book-recommendation-system-9uba.onrender.com/user', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setIsAuthenticated(true);
                    setIsAdmin(response.data.role === 'admin'); // Define isAdmin baseado no papel do usuário
                } catch (error) {
                    console.error('Erro ao verificar autenticação:', error);
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
        };

        checkAuthStatus();
    }, []);

    const handleLogin = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false); // Limpa o estado de isAdmin também ao fazer logout
        localStorage.removeItem('token');
    };

    if (isAuthenticated === null) {
        // Enquanto a autenticação estiver sendo verificada, mostra um indicador de carregamento
        return <div>Carregando...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} />

                {/* Rota principal "/" usando a HomePage dentro de uma ProtectedRoute e Layout */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <HomePage handleLogout={handleLogout} />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Rota de sucesso após login com o Google */}
                <Route path="/auth/success" element={<AuthSuccess setIsAuthenticated={setIsAuthenticated} />} />

                {/* Rota para AdminPage */}
                {isAdmin && (
                    <Route path="/admin" element={<AdminPage />} />
                )}

                {/* Rotas protegidas para busca de livros */}
                <Route
                    path="/search-books"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <BookSearchPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/book/:bookId"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <BookDetailsPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/book-review/:bookId"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <BookReviewPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-books"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <UserBooksPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                
                {/* Rota para RankingPage protegida */}
                <Route
                    path="/ranking"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <RankingPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Rota para Feed de comentários protegida */}
                <Route
                    path="/comentarios"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <Feed />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
