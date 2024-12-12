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
import PostForm from './components/Feed/PostForm'; // Novo: formulário para criar postagens
import Feed from './components/Feed/Feed'; // Novo: componente para exibir o feed de postagens
import Layout from './components/Header/Layout'; // Importa o Layout
import 'bootstrap/dist/css/bootstrap.min.css';

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
                    path="/postar"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout>
                                <PostForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/feed"
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
