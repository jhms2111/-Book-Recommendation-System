import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress, Container, Button, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔹 Função para buscar usuários
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get("https://book-recommendation-system-9uba.onrender.com/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(response.data);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Função para deletar usuário
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("authToken");

            await axios.delete(`https://book-recommendation-system-9uba.onrender.com/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Usuário excluído com sucesso!");

            // Atualiza a lista de usuários após a exclusão
            setUsers(users.filter(user => user._id !== userId));

        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            alert("Erro ao excluir usuário.");
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
                                    <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                                        <DeleteIcon />
                                    </IconButton>
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
