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
import AdminRoute from './components/Auth/AdminRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('https://book-recommendation-system-9uba.onrender.com/api/user/me', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setUser(res.data);
                setIsAuthenticated(true);
            }).catch(() => {
                setIsAuthenticated(false);
            });
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
        localStorage.removeItem('isAuthenticated');
    };

    if (isAuthenticated === null) {
        return <div>Carregando...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} />
                <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><HomePage handleLogout={handleLogout} /></Layout></ProtectedRoute>} />
                <Route path="/auth/success" element={<AuthSuccess setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/search-books" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><BookSearchPage /></Layout></ProtectedRoute>} />
                <Route path="/book/:bookId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><BookDetailsPage /></Layout></ProtectedRoute>} />
                <Route path="/book-review/:bookId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><BookReviewPage /></Layout></ProtectedRoute>} />
                <Route path="/my-books" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><UserBooksPage /></Layout></ProtectedRoute>} />
                <Route path="/ranking" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><RankingPage /></Layout></ProtectedRoute>} />
                <Route path="/comentarios" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Layout><Feed /></Layout></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute isAuthenticated={isAuthenticated} user={user}><Layout><AdminDashboard /></Layout></AdminRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
