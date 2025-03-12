import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress, Container, Button } from "@mui/material";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
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
