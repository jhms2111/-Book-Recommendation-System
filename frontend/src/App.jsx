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
import RankingPage from './pages/Ranking/RankingPage'
import Feed from './components/Feed/Feed'; // Novo: componente para exibir o feed de postagens
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/Auth/AdminRoute";
import Layout from './components/Header/Layout'; // Importa o Layout
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);



    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
    
        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }, []);
    




    const handleLogin = () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
    
        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    };
    

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
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

                <Route
                    path="/admin"
                    element={
                        <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                            <Layout>
                                <AdminDashboard />
                            </Layout>
                        </AdminRoute>
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
