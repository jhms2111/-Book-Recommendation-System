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
import AdminPage from "./pages/Admin/AdminPage";
import AdminRoute from "./components/Auth/AdminRoute";
import Layout from './components/Header/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 🔥 Agora começa como false
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
    
            if (token) {
                try {
                    // 🔹 Verifica se o token tem o formato correto (3 partes separadas por ".")
                    const parts = token.split(".");
                    if (parts.length !== 3) {
                        throw new Error("Formato de token inválido");
                    }
    
                    // 🔹 Decodifica o payload do JWT
                    const payload = JSON.parse(atob(parts[1]));
    
                    // 🔹 Verifica se o payload tem a role antes de definir o estado
                    if (payload.role) {
                        setUserRole(payload.role);
                        setIsAuthenticated(true);
                    } else {
                        throw new Error("Payload inválido no token");
                    }
                } catch (error) {
                    console.error("Erro ao decodificar o token:", error);
                    setIsAuthenticated(false);
                    setUserRole(null);
                    localStorage.removeItem("token"); // 🔥 Remove o token inválido
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
            }
    
            setLoading(false);
        };
    
        checkAuth();
    }, []);
    

    const handleLogin = (token) => {
        if (!token || typeof token !== "string") {
            console.error("Token inválido recebido:", token);
            return;
        }
    
        localStorage.setItem("token", token);
    
        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                throw new Error("Formato de token inválido");
            }
    
            const payload = JSON.parse(atob(parts[1]));
    
            if (payload.role) {
                setUserRole(payload.role);
                setIsAuthenticated(true);
            } else {
                throw new Error("Payload inválido no token");
            }
        } catch (error) {
            console.error("Erro ao processar o token:", error);
            setIsAuthenticated(false);
            setUserRole(null);
            localStorage.removeItem("token"); // 🔥 Remove o token inválido
        }
    };
    

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('token');
    };

    if (loading) {
        return <div className="loading-screen">🔄 Carregando...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* 🔥 Protegendo a Rota de Admin */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                            <AdminPage />
                        </AdminRoute>
                    }
                />

                {/* 🔐 Login e Cadastro */}
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} />

                {/* 🔐 Rota Protegida para HomePage */}
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

                {/* 🔐 Rota de Sucesso do Google */}
                <Route path="/auth/success" element={<AuthSuccess setIsAuthenticated={handleLogin} />} />

                {/* 🔐 Rotas Protegidas */}
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
                
                {/* 🔐 Rotas para Postagens */}
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
