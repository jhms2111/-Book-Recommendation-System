const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const userRoutes = require('../adapters/controllers/user/userRoutes');
const authRoutes = require('../adapters/controllers/auth/googleAuthRoutes'); // Certifique-se de que esse é um router válido
const booksRoutes = require('../adapters/routers/bookRoutes'); // Corrigido o caminho do arquivo
console.log("✅ booksRoutes foi carregado no server.js");
const postagemRoutes = require('../adapters/routers/postagemRoutes'); // Importa as rotas de postagens

require('../infrastructure/auth/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS
const corsOptions = {
    origin: "https://book-recommendation-system-omega.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
};
app.use(cors(corsOptions));

// Middleware para analisar JSON corretamente
app.use(express.json());

// Configurar sessão
app.use(session({ secret: 'seuSegredo', resave: false, saveUninitialized: true }));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Conexão com MongoDB Atlas usando a variável de ambiente
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conectado ao MongoDB Atlas com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

// 🔹 🔥 GARANTINDO QUE O LOGIN FUNCIONE 🔥
app.post('/api/login', async (req, res) => {
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const User = require('../infrastructure/dataBase/models/User');

    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign(
            { id: usuario._id, name: usuario.name, email: usuario.email, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login bem-sucedido", token, usuario });
    } catch (error) {
        res.status(500).json({ error: "Erro ao processar login", details: error });
    }
});

// 🔹 🔥 GARANTINDO QUE APENAS ADMINS POSSAM ACESSAR /api/users 🔥
const authenticateUser = require('../middleware/authenticateUser');
const isAdmin = require('../middleware/isAdmin');

app.use('/api/users', authenticateUser, isAdmin, userRoutes);

// Usar as rotas existentes
console.log("Carregando as rotas de livros...");
app.use('/api/books', booksRoutes);
app.use('/api', postagemRoutes);
app.use(authRoutes); 

// Rota principal
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
