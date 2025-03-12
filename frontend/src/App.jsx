import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignupPage from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthSuccess from './components/Auth/AuthSuccess';
import BookSearchPage from './pages/Books/BookSearchPage';
import BookDetailsPage from './pages/Books/BookDetailsPage';
import HomePage from './pages/Home/HomePage'; // Importa o componente HomePage
import BookReviewPage from './pages/Books/BookReviewPage'; // Importe o componente da página de avaliação
import UserBooksPage from './pages/Books/UserBooksPage';
import RankingPage from './pages/Ranking/RankingPage';
import Feed from './components/Feed/Feed'; // Novo: componente para exibir o feed de postagens
import AdminPage from "./pages/Admin/AdminPage";
import AdminRoute from "./components/Auth/AdminRoute"; // 🔥 Novo Middleware
import Layout from './components/Header/Layout'; // Importa o Layout
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true); // 🔥 Novo estado de carregamento

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o JWT
                    setUserRole(payload.role); // Obtém a role do usuário
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Erro ao decodificar o token:", error);
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
            }

            setLoading(false); // 🔹 Finaliza o carregamento
        };

        checkAuth();
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
    };

    if (loading) {
        return <div className="loading-screen">🔄 Carregando...</div>; // 🔥 Agora o carregamento desaparece corretamente
    }

    return (
        <Router>
            <Routes>
                {/* 🔥 Rota protegida de Admin */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                            <AdminPage />
                        </AdminRoute>
                    }
                />

                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} />

                {/* Rota principal "/" usando o componente HomePage dentro de uma ProtectedRoute e Layout */}
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
                
                {/* Rotas para Postagens */}
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
