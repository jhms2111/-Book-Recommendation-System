import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // Atualizando a URL de requisição para o backend hospedado no Render
            const response = await axios.post("https://book-recommendation-system-9uba.onrender.com/api/login", {
                email,
                senha,
            });

            if (response.data && response.data.token) {
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("isAuthenticated", "true");

                setSuccess("✅ ¡Inicio de sesión exitoso!");
                handleLogin();
                navigate("/");
            } else {
                setError("⚠️ Error: No se recibió el token JWT.");
            }
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            setError(err.response?.data?.error || "Error al conectar con el servidor.");
        }
    };

    const handleGoogleLogin = () => {
        // Atualizando a URL de redirecionamento para o Google OAuth no backend hospedado no Render
        window.location.href = "https://book-recommendation-system-9uba.onrender.com/auth/google";
    };

    return (
        <Box sx={styles.container}>
            <Container sx={styles.card}>
                <Typography variant="h4" sx={styles.title}>
                    Bienvenido
                </Typography>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <TextField
                        fullWidth
                        label="Correo Electrónico"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={styles.input}
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
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
                    <Button type="submit" variant="contained" sx={styles.button}>
                        Iniciar Sesión
                    </Button>
                    <Button
                        variant="outlined"
                        sx={styles.googleButton}
                        onClick={handleGoogleLogin}
                        endIcon={<Google sx={{ color: "#fff" }} />}
                    >
                        Google
                    </Button>

                    <Button variant="text" onClick={() => navigate("/signup")} sx={styles.link}>
                        Crear cuenta
                    </Button>
                    <Button variant="text" onClick={() => navigate("/forgot-password")} sx={styles.forgotPassword}>
                        Olvidé mi contraseña
                    </Button>
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
        width: "100vw", // Asegura que la pantalla se quede fija
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
        maxWidth: "400px", // 📱 Mantiene 400px en dispositivos móviles

        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        // 🔽 Ajuste para pantallas más grandes
        "@media (min-width: 768px)": {
            maxWidth: "350px", // 📺 Reduce para tabletas y computadoras portátiles medianas
        },
        "@media (min-width: 1024px)": {
            maxWidth: "380px", // 🖥️ Reduce aún más para escritorios grandes
        },
    },
    title: {
        color: "#fff",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
        fontSize: "32px",
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
        padding: "14px",
        borderRadius: "8px",
        fontSize: "18px",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
        fontWeight: "bold",
        "&:hover": {
            backgroundColor: "#f5f5f5",
        },
    },
    googleButton: {
        backgroundColor: "transparent",
        border: "2px solid white",
        color: "#fff",
        padding: "8px 16px", // 🔽 Reduce el padding para menor ancho
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        width: "auto", // 🔥 Hace que el botón tenga el tamaño mínimo necesario
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px", // Espaciado entre el texto y el ícono
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
    },
    link: {
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "10px",
        textTransform: "none",
    },
    forgotPassword: {
        color: "#bbb",
        fontSize: "14px",
        marginTop: "5px",
        textTransform: "none",
        "&:hover": {
            color: "#fff",
        },
    },
    error: {
        color: "#ff5c5c",
        marginTop: "10px",
        fontSize: "16px",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
    },
    success: {
        color: "#4CAF50",
        marginTop: "10px",
        fontSize: "16px",
        fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
    },
};

Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
};

export default Login;
