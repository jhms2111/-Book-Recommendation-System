const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const userRoutes = require('../adapters/controllers/user/userRoutes');
const authRoutes = require('../adapters/controllers/auth/googleAuthRoutes');
const booksRoutes = require('../adapters/routers/bookRoutes');
console.log("✅ booksRoutes foi carregado no server.js");
const postagemRoutes = require('../adapters/routers/postagemRoutes');

require('../infrastructure/auth/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS
const corsOptions = {
    origin: 'https://book-recommendation-system-weld.vercel.app/', // Atualizado para o link do frontend
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

// Usar as rotas
console.log("Carregando as rotas de livros...");
app.use('/api/books', booksRoutes);
app.use('/api', postagemRoutes);
app.use(userRoutes);
app.use(authRoutes); 

// Rota principal
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
