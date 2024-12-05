const express = require('express');
const bcrypt = require('bcrypt'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para geração e verificação de tokens JWT
const User = require('../../../infrastructure/database/models/User');
const authenticateUser = require('../middleware/authenticateUser'); // Middleware de autenticação

const router = express.Router();

// Função para validar o formato do email
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// Função para verificar a força da senha
const isPasswordStrong = (senha) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(senha);
};



// ** ROTAS DE AUTENTICAÇÃO **

// src/routes/userRoutes.js

router.post('/api/usuarios', async (req, res) => {
    const { nomeCadastrado, email, senha } = req.body;

    // Verifique se todos os campos obrigatórios foram fornecidos
    if (!nomeCadastrado || !email || !senha) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verificar formato do email
    if (!validateEmail(email)) {
        return res.status(400).send({ error: 'Formato de email inválido.' });
    }

    // Verificar força da senha
    if (!isPasswordStrong(senha)) {
        return res.status(400).send({ error: 'Senha fraca. Deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.' });
    }

    try {
        // Verificar se o email já está cadastrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'O email já está cadastrado.' });
        }

        // Criar o usuário e preencher o campo 'name' com 'nomeCadastrado'
        const hashedPassword = await bcrypt.hash(senha, 10);
        const usuario = new User({
            nome: nomeCadastrado,  // Preenche o campo nome com o nomeCadastrado
            nomeCadastrado,        // Nome para cadastro manual
            email,
            senha: hashedPassword,
        });

        // Log para verificar os dados do usuário antes de salvar
        console.log('Usuário sendo criado:', usuario);

        // Salva o usuário no banco de dados
        await usuario.save();
        res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao tentar cadastrar o usuário:', error);
        res.status(500).send({ error: 'Erro interno no servidor', details: error.message });
    }
});












router.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(400).send({ error: 'Usuário não encontrado' });
        }

        // Verificando a senha
        const match = await bcrypt.compare(senha, usuario.senha);
        if (!match) {
            return res.status(400).send({ error: 'Senha incorreta' });
        }

        // Verificando qual nome usar
        // Usamos o nome vindo do Google (se disponível) ou o nome do banco de dados
        const nomeUsuario = usuario.name || usuario.nomeCadastrado || usuario.nome;  // 'name' do Google, 'nomeCadastrado' ou 'nome'

        // Gerar o token JWT com id, nome e email
        const token = jwt.sign(
            { 
                id: usuario._id, 
                name: nomeUsuario,  // 'name' do Google ou 'nomeCadastrado' do banco de dados
                email: usuario.email 
            },
            process.env.JWT_SECRET,  // Usa a chave secreta definida no .env
            { expiresIn: '1h' }  // Token expira em 1 hora
        );

        res.send({ message: 'Login bem-sucedido', token, usuario });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao fazer login', details: error });
    }
});







// ** ROTAS PARA RECUPERAÇÃO DE SENHA **

// Solicitar recuperação de senha
router.post('/api/recover', async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).send({ error: 'Usuário não encontrado' });
        }

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Token expira em 15 minutos
        );

        console.log(`Envie um email para ${email} com o token: ${token}`);
        res.send({ message: 'Instruções de recuperação de senha enviadas ao email.' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao solicitar recuperação de senha', details: error });
    }
});

// Redefinir senha
router.post('/api/reset-password', async (req, res) => {
    const { token, novaSenha } = req.body;

    if (!token) {
        return res.status(400).send({ error: 'Token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await User.findById(decoded.id);
        if (!usuario) {
            return res.status(400).send({ error: 'Usuário não encontrado.' });
        }

        const hashedPassword = await bcrypt.hash(novaSenha, 10);
        usuario.senha = hashedPassword;
        await usuario.save();

        res.send({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao redefinir senha', details: error });
    }
});



// Buscar livros do usuário
router.get('/api/user/books', authenticateUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        res.status(200).json({ books: user.books });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar livros do usuário.', details: error });
    }
});

// Testar funcionamento
router.get('/api/test', (req, res) => {
    res.send({ message: 'Rota de teste funcionando!' });
});

module.exports = router;