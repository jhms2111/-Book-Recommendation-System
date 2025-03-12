module.exports = (req, res, next) => {
    console.log("Usuário autenticado:", req.user); // <-- Adicionado para verificar o que chega aqui

    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Acesso negado! Apenas administradores podem acessar esta rota." });
    }
    next();
};
