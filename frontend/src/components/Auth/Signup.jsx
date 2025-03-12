import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (senha !== confirmSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const response = await axios.post("https://book-recommendation-system-9uba.onrender.com/api/usuarios", {
                name,
                email,
                senha,
            });
            setSuccess(response.data.message);
            setName("");
            setEmail("");
            setSenha("");
            setConfirmSenha("");
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error);
            } else {
                setError("Erro ao se conectar ao servidor. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <Box sx={styles.container}>
            <Container sx={styles.card}>
                <Typography variant="h4" sx={styles.title}>
                    Criar Conta
                </Typography>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <TextField
                        fullWidth
                        label="Nome"
                        variant="outlined"
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        sx={styles.input}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={styles.input}
                    />
                    <TextField
                        fullWidth
                        label="Senha"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        sx={styles.input}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff sx={{ color: "#fff" }} /> : <Visibility sx={{ color: "#fff" }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Confirme sua Senha"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        value={confirmSenha}
                        onChange={(e) => setConfirmSenha(e.target.value)}
                        required
                        sx={styles.input}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff sx={{ color: "#fff" }} /> : <Visibility sx={{ color: "#fff" }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" variant="contained" sx={styles.button}>
                        Cadastrar
                    </Button>
                    <Typography sx={styles.linkText}>
                        Já tem uma conta?{" "}
                        <Button variant="text" onClick={() => navigate("/login")} sx={styles.loginLink}>
                            Faça login
                        </Button>
                    </Typography>
                    {error && <Typography sx={styles.error}>{error}</Typography>}
                    {success && <Typography sx={styles.success}>{success}</Typography>}
                </form>
            </Container>
        </Box>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#1c0101",
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(12px)",
        textAlign: "center",
        width: "100%",
        maxWidth: "320px", // Mantém o tamanho original para mobile
        
        minHeight: "450px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        // 🔥 Reduz a largura do formulário apenas em telas maiores
        "@media (min-width: 768px)": {  
            maxWidth: "280px", // Ajuste para telas médias e grandes
        },
        "@media (min-width: 1024px)": {  
            maxWidth: "380px", // Ajuste ainda menor para desktops grandes
        },
    },
    title: {
        color: "#fff",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        input: {
            color: "#fff",
            fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.5)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
        },
    },
    button: {
        backgroundColor: "#fff",
        color: "#1c0101",
        padding: "12px",
        borderRadius: "8px",
        fontSize: "16px",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
        fontWeight: "bold",
        "&:hover": {
            backgroundColor: "#f5f5f5",
        },
    },
    linkText: {
        color: "#fff",
        marginTop: "10px",
        fontSize: "14px",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
    },
    loginLink: {
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    error: {
        color: "#ff5c5c",
        marginTop: "10px",
        fontSize: "14px",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
    },
    success: {
        color: "#4CAF50",
        marginTop: "10px",
        fontSize: "14px",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
    },
    
};


export default Signup;
