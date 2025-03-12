import { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token"); // Pegando o token salvo no localStorage
            try {
                const response = await fetch("https://book-recommendation-system-9uba.onrender.com/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar usuários. Verifique se você é um administrador.");
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Painel Administrativo</h2>
            {loading && <p>Carregando usuários...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
                <table className="table table-bordered mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Função</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
