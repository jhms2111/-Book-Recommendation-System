const jwt = require("jsonwebtoken");
const User = require("../infrastructure/dataBase/models/User"); // Importa o modelo de usuário para buscar no banco

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Pega o token JWT do cabeçalho

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔹 Garante que o usuário está atualizado no banco antes de passar adiante
        const user = await User.findById(decoded.id).select("name email role");
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        // 🔹 Reatribui o usuário ao req.user, garantindo que `role` esteja sempre presente
        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // ✅ Agora sempre teremos role!
        };

        next(); // Passa o controle para a próxima função
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = authenticateUser;
