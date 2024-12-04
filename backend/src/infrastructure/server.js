const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const userRoutes = require('../adapters/controllers/user/userRoutes');
const authRoutes = require('../adapters/controllers/auth/googleAuthRoutes'); // Certifique-se de que esse é um router válido
require('../infrastructure/auth/passport');

const booksRoutes = require('../adapters/controllers/booksRoutes'); // Importa as rotas de livros
const postagemRoutes = require('../adapters/routers/postagemRoutes'); // Importa as rotas de postagens

const app = express();
const PORT = process.env.PORT || 5000;

// Usar CORS
app.use(cors({
    origin: 'http://localhost:5173', // Permitir apenas a origem do frontend
    credentials: true // Permitir cookies e credenciais
}));

// Middleware para analisar o corpo das requisições
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
app.use(userRoutes);
app.use(authRoutes); // Usa as rotas de autenticação corretamente (assumindo que authRoutes seja um router válido)

// Usar as rotas de postagens
app.use('/api', postagemRoutes); // Usa as rotas de postagens

// Rota principal
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
