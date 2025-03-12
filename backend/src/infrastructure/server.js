const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

// 🔹 Certifique-se de que este arquivo contém a rota POST /login
const loginRoutes = require('../adapters/controllers/auth/authRoutes'); 

// 🔹 Importação correta dos arquivos de rota
const userRoutes = require('../adapters/controllers/user/userRoutes'); 
const authRoutes = require('../adapters/controllers/auth/googleAuthRoutes'); // Certifique-se de que esse é um router válido
const booksRoutes = require('../adapters/routers/bookRoutes'); 
console.log("✅ booksRoutes foi carregado no server.js");
const postagemRoutes = require('../adapters/routers/postagemRoutes'); 

require('../infrastructure/auth/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Configuração do CORS para permitir requisições do frontend (Vercel)
const corsOptions = {
    origin: "https://book-recommendation-system-omega.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
};
app.use(cors(corsOptions));

// 🔹 Middleware para analisar JSON corretamente
app.use(express.json());

// 🔹 Configurar sessão
app.use(session({ secret: 'seuSegredo', resave: false, saveUninitialized: true }));

// 🔹 Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Conexão com MongoDB Atlas usando variável de ambiente
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado ao MongoDB Atlas com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// 🔹 Registrar todas as rotas corretamente
console.log("Carregando as rotas...");

// 🔹 Agora as rotas possuem o prefixo correto para garantir que funcionem
app.use('/api/books', booksRoutes); 
app.use('/api/postagens', postagemRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/auth', authRoutes); 

// 🔹 🔥 GARANTINDO QUE O LOGIN FUNCIONA 🔥
app.use('/api', loginRoutes); // 🔥 Isso garante que POST /api/login funcione!

// 🔹 Rota de teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// 🔹 Iniciar o servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});
