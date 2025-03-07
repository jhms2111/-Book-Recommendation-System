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
    origin: "https://book-recommendation-system-omega.vercel.app/", // 🔥 Permite qualquer origem (substitua depois pelo endereço correto)
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

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/BookRecommendationSystem', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Usar as rotas
console.log("Carregando as rotas de livros...");
app.use('/api/books', booksRoutes);
  // Agora corretamente adicionado após express.json()
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
