import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress, Container, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null); // Armazena o usuário a ser deletado
    const [openDialog, setOpenDialog] = useState(false); // Controla a exibição do modal
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔹 Buscar usuários da API
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
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

    // 🔹 Abrir modal de confirmação antes de deletar
    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    // 🔹 Fechar modal sem deletar
    const handleCloseDialog = () => {
        setSelectedUser(null);
        setOpenDialog(false);
    };

    // 🔥 Função para deletar usuário
    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        try {
            const token = localStorage.getItem("authToken");

            axios.delete(`https://book-recommendation-system-9uba.onrender.com/api/users/${selectedUser._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Usuário excluído com sucesso!");

            // Atualiza a lista de usuários após a exclusão
            setUsers(users.filter(user => user._id !== selectedUser._id));

        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            alert("Erro ao excluir usuário.");
        } finally {
            handleCloseDialog();
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
                                    <IconButton color="error" onClick={() => handleOpenDialog(user)}>
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

            {/* 🔥 Modal de Confirmação antes de excluir */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
                        Essa ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
                    <Button onClick={handleDeleteUser} color="error">Excluir</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPage;
