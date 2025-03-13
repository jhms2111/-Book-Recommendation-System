import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, List, ListItem, Rating } from "@mui/material";
import { Link } from "react-router-dom";

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
                console.error("❌ Error loading ranking:", error);
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
                📚 Top 10 Best Rated Books
            </Typography>
            <List sx={{ maxWidth: "600px", margin: "0 auto" }}>
                {ranking.map((book, index) => (
                    <ListItem 
                        key={book._id.bookId} 
                        sx={{ 
                            display: "flex", 
                            flexDirection: "column", // Stacks elements on mobile
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid #ddd",
                            textAlign: "center"
                        }}
                    >
                        {/* Rank and Clickable Book Title */}
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: "bold", 
                                fontSize: { xs: "16px", md: "18px" }, 
                                wordWrap: "break-word",
                                overflowWrap: "break-word", 
                                maxWidth: "90%"
                            }}
                        >
                            #{index + 1}{" "}
                            <Link 
                                to={`/book-review/${book._id.bookId}`} 
                                style={{ textDecoration: "none", color: "#007BFF", fontWeight: "bold" }}
                            >
                                {book._id.bookTitle}
                            </Link>
                        </Typography>

                        {/* Stars - Now positioned below the title on mobile */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px" }}>
                            <Rating value={book.avgRating} precision={0.1} readOnly />
                            <Typography sx={{ marginLeft: "8px", fontSize: { xs: "12px", md: "14px" } }}>
                                ({book.avgRating.toFixed(1)})
                            </Typography>
                        </Box>

                        {/* Number of Reviews */}
                        <Typography 
                            sx={{ 
                                fontSize: { xs: "12px", md: "14px" }, 
                                color: "#666", 
                                marginTop: "5px"
                            }}
                        >
                            📊 {book.count} reviews
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default RankingPage;
