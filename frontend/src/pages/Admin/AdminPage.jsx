import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../../components/Admin/UserList";
import Layout from "../../components/Header/Layout";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token"); // Pegando o token salvo no login

            if (!token) {
                alert("Você precisa estar autenticado!");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("https://book-recommendation-system-9uba.onrender.com/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar usuários!");
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchUsers();
    }, [navigate]);

    return (
        <Layout>
            <div className="container mt-4">
                <h2>Administração</h2>
                <UserList users={users} />
            </div>
        </Layout>
    );
};

export default AdminPage;
