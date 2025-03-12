import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, List, ListItem, Rating } from "@mui/material";

const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.get("https://book-recommendation-system-9uba.onrender.com/api/ranking");
                setRanking(response.data);
                setLoading(false);
            } catch (error) {
                console.error("❌ Error al cargar el ranking:", error);
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "20px", textAlign: "center", marginTop: "30px" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px", fontSize: { xs: "18px", md: "24px" } }}>
                📚 Top 10 Libros Mejor Valorados
            </Typography>
            <List sx={{ maxWidth: "600px", margin: "0 auto" }}>
                {ranking.map((book, index) => (
                    <ListItem 
                        key={book._id.bookId} 
                        sx={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid #ddd",
                            flexWrap: "wrap"
                        }}
                    >
                        {/* Número e Nome do Livro */}
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            width: { xs: "100%", md: "60%" }, 
                            textAlign: "left",
                            fontSize: { xs: "14px", md: "18px" }
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: "bold", 
                                    fontSize: { xs: "14px", md: "18px" }, 
                                    whiteSpace: "nowrap", 
                                    overflow: "hidden", 
                                    textOverflow: "ellipsis" 
                                }}
                            >
                                #{index + 1} {book._id.bookTitle}
                            </Typography>
                        </Box>

                        {/* Estrelas e Média */}
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            width: { xs: "100%", md: "40%" }, 
                            marginTop: { xs: "5px", md: "0" } 
                        }}>
                            <Rating value={book.avgRating} precision={0.1} readOnly />
                            <Typography sx={{ marginLeft: "8px", fontSize: { xs: "12px", md: "14px" } }}>
                                ({book.avgRating.toFixed(1)})
                            </Typography>
                        </Box>

                        {/* Quantidade de Avaliações */}
                        <Typography 
                            sx={{ 
                                fontSize: { xs: "12px", md: "14px" }, 
                                color: "#666", 
                                width: "100%", 
                                textAlign: "center", 
                                marginTop: "5px"
                            }}
                        >
                            📊 {book.count} valoraciones
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default RankingPage;
