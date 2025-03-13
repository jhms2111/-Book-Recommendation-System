import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress,
    Container, Button, IconButton, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminCommentsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get("http://localhost:5000/api/postagens", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPosts(response.data);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [navigate]);

    // 🛠 Função para remover uma postagem
    const handleRemovePost = async (_id, ) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta postagem?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("❌ Usuário não autenticado.");
                return;
            }

            console.log("📝 Enviando requisição DELETE para:", _id);

            // Corrigido o endpoint da requisição
            const response = await axios.delete(`http://localhost:5000/api/postagens/${_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                console.log("✅ Postagem removida com sucesso!");
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== _id)); // Filtra corretamente a postagem
                alert("Postagem excluída com sucesso!");
            } else {
                console.error("⚠️ Erro ao remover a postagem:", response.data);
                alert("Erro ao remover a postagem.");
            }
        } catch (error) {
            console.error("❌ Erro ao excluir a postagem:", error.response ? error.response.data : error);
            alert("Erro ao excluir a postagem.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Gerenciar Comentários</Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Usuário</strong></TableCell>
                            <TableCell><strong>Comentário</strong></TableCell>
                            <TableCell><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post._id}>
                                <TableCell>{post.userName}</TableCell>
                                <TableCell>{post.content}</TableCell>
                                <TableCell>
                                    <Tooltip title="Excluir postagem">
                                        <IconButton 
                                            onClick={() => handleRemovePost(post._id, post.userId)} // Passa o _id e userId
                                            sx={{ color: "red" }}
                                        >
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

export default AdminCommentsPage;
