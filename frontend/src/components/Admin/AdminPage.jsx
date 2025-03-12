// components/Admin/AdminPage.jsx

import  { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtém o token JWT do localStorage
                const res = await axios.get('https://book-recommendation-system-9uba.onrender.com/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(res.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Lista de Usuários</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <strong>{user.name}</strong> - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
