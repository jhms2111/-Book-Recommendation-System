import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress,
    Container, Button, IconButton, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Certifique-se de usar a chave correta
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get("https://book-recommendation-system-9uba.onrender.com/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsers(response.data);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    // 🛠 Função para remover um usuário
    const handleRemoveUser = async (userId) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("❌ Usuário não autenticado.");
                return;
            }

            const response = await axios.delete(`https://book-recommendation-system-9uba.onrender.com/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                console.log("✅ Usuário removido com sucesso!");
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            } else {
                console.error("⚠️ Erro ao remover o usuário:", response.data);
            }
        } catch (error) {
            console.error("❌ Erro ao excluir o usuário:", error.response ? error.response.data : error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Administração de Usuários</Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Função</strong></TableCell>
                            <TableCell><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Tooltip title="Excluir usuário">
                                        <IconButton onClick={() => handleRemoveUser(user._id)} sx={{ color: "red" }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => navigate("/")}>
                Voltar para Home
            </Button>
        </Container>
    );
};

export default AdminPage;
