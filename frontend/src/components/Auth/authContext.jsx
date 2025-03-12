import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Importação do PropTypes
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Função de login
  const login = async (email, senha) => {
    try {
      const res = await axios.post("https://book-recommendation-system-9uba.onrender.com/api/login", { email, senha });
      const { token, usuario } = res.data;

      setToken(token);
      setUser(usuario);
      localStorage.setItem("token", token);

      if (usuario.role === "admin") {
        navigate("/dashboard");
      } else {
        alert("Acesso negado! Apenas administradores podem acessar.");
        logout();
      }
    } catch (error) {
      console.error("Erro no login:", error); // ✅ Agora estamos usando o erro corretamente
      alert("Erro no login!");
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Adicionando validação de props para evitar warnings do ESLint
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

