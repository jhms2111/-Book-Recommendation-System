import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, Rating } from "@mui/material";

const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/ranking");
                setRanking(response.data);
                setLoading(false);
            } catch (error) {
                console.error("❌ Erro ao carregar ranking:", error);
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: "20px", textAlign: "center", marginTop: "50px" }}>
            <Typography variant="h4" gutterBottom>
                📚 **Top 10 Livros Mais Bem Avaliados**
            </Typography>
            <List>
                {ranking.map((book, index) => (
                    <ListItem key={book._id.bookId} sx={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            #{index + 1} {book._id.bookTitle} 
                        </Typography>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Rating value={book.avgRating} precision={0.1} readOnly />
                                    <Typography sx={{ marginLeft: "10px" }}>({book.avgRating.toFixed(1)})</Typography>
                                </Box>
                            }
                            secondary={`📊 Avaliações: ${book.count}`} // Exibe a quantidade de avaliações
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default RankingPage;
