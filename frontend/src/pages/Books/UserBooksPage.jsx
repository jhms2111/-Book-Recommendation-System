import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Tooltip, IconButton, CircularProgress, Container
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

                const response = await axios.get("https://book-recommendation-system-9uba.onrender.com/api/postagens", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPosts(response.data);
            } catch (error) {
                console.error("❌ Erro ao buscar postagens:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // 🛠 Função para remover uma postagem
    const handleRemovePost = async (postId) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta postagem?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("❌ Usuário não autenticado.");
                return;
            }

            const response = await axios.delete(`https://book-recommendation-system-9uba.onrender.com/api/postagens/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                console.log("✅ Postagem removida com sucesso!");
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            } else {
                console.error("⚠️ Erro ao remover a postagem:", response.data);
            }
        } catch (error) {
            console.error("❌ Erro ao excluir a postagem:", error.response ? error.response.data : error);
        }
    };

    return (
        <Container>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontFamily: "Georgia, serif",
                    color: "#5A3E36",
                    marginTop: "20px",
                    textAlign: "center"
                }}
            >
                📝 Gerenciar Comentários
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f8f8f8",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {posts.map((post) => (
                        <Box key={post._id} sx={{ position: "relative", background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "3px 3px 8px rgba(0,0,0,0.3)" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{post.userName}</Typography>
                            <Typography variant="body1" sx={{ marginBottom: "10px" }}>{post.content}</Typography>
                            <Tooltip title="Excluir postagem">
                                <IconButton
                                    onClick={() => handleRemovePost(post._id)}
                                    sx={{ position: "absolute", top: 5, right: 5, color: "red" }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default AdminCommentsPage;
