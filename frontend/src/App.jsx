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
import Layout from './components/Header/Layout';
import AdminPage from "./pages/Admin/AdminPage"; // 🔥 Novo: Página do Admin
import AdminRoute from "./components/Auth/AdminRoute"; // 🔥 Novo: Proteção da rota Admin
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(token === 'true');

        // 🔥 Obtendo a role do usuário no token (apenas se houver token)
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o token JWT
                setUserRole(payload.role); // Define a role do usuário
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                setUserRole(null);
            }
        }
    }, []);

    const handleLogin = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload.role); // Define a role do usuário ao logar
        } catch (error) {
            console.error("Erro ao processar o token:", error);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('token');
    };

    if (isAuthenticated === null) {
        return <div>Carregando...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} />

                {/* 🔹 Rota protegida principal */}
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

                {/* 🔹 Rota de sucesso após login com o Google */}
                <Route path="/auth/success" element={<AuthSuccess setIsAuthenticated={setIsAuthenticated} />} />

                {/* 🔹 Rotas protegidas para livros */}
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

                {/* 🔹 Rotas para postagens */}
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

                {/* 🔥 🔹 Nova Rota protegida para Admin */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                            <Layout>
                                <AdminPage />
                            </Layout>
                        </AdminRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
