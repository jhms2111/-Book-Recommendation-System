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
import AdminDashboard from './pages/Admin/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwtDecode from "jwt-decode";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null); // 🔹 Apenas para verificar admin

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // 🔹 Decodifica o token
                setIsAuthenticated(true);
                setUserRole(decoded.role); // 🔹 Pegamos apenas o `role`
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
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

                {/* Rota principal */}
                <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><HomePage handleLogout={handleLogout} /></Layout></ProtectedRoute>} />
                <Route path="/auth/success" element={<AuthSuccess setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/search-books" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><BookSearchPage /></Layout></ProtectedRoute>} />
                <Route path="/book/:bookId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><BookDetailsPage /></Layout></ProtectedRoute>} />
                <Route path="/book-review/:bookId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><BookReviewPage /></Layout></ProtectedRoute>} />
                <Route path="/my-books" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><UserBooksPage /></Layout></ProtectedRoute>} />
                <Route path="/ranking" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><RankingPage /></Layout></ProtectedRoute>} />
                <Route path="/comentarios" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><Feed /></Layout></ProtectedRoute>} />

                {/* 🔹 Rota protegida para Admin */}
                <Route path="/admin" element={userRole === "admin" ? <Layout><AdminDashboard /></Layout> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
