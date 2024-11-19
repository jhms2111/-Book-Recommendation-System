// backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt'); // Para hash de senha
const User = require('../../../infrastructure/database/models/User');

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

router.post('/api/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Log para verificar se todos os campos estão recebidos
    console.log('Dados recebidos para cadastro:', req.body);

    // Verifique se todos os campos foram recebidos
    if (!nome || !email || !senha) {
        console.log('Erro: Campos obrigatórios não foram preenchidos.');
        return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
    }

    // Validar o formato do email
    if (!validateEmail(email)) {
        console.log('Erro: Formato de email inválido:', email);
        return res.status(400).send({ error: 'Formato de email inválido.' });
    }

    // Verificar a força da senha
    if (!isPasswordStrong(senha)) {
        console.log('Erro: Senha fraca.');
        return res.status(400).send({ error: 'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const usuario = new User({ nome, email, senha: hashedPassword });
        await usuario.save();
        console.log('Usuário cadastrado com sucesso:', usuario);
        res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.log('Erro ao cadastrar usuário:', error);
        res.status(400).send({ error: 'Erro ao cadastrar usuário', details: error });
    }
});


// backend/routes/userRoutes.js
router.post('/api/login', async (req, res) => {
    console.log('Requisição recebida para login:', req.body);
    
    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            console.log('Usuário não encontrado:', email);
            return res.status(400).send({ error: 'Usuário não encontrado' });
        }

        const match = await bcrypt.compare(senha, usuario.senha);
        if (!match) {
            console.log('Senha incorreta para o usuário:', email);
            return res.status(400).send({ error: 'Senha incorreta' });
        }

        // Se o login for bem-sucedido, envie a resposta
        console.log('Login bem-sucedido para o usuário:', usuario);
        res.send({ message: 'Login bem-sucedido', usuario }); // Envie a resposta ao frontend
    } catch (error) {
        console.log('Erro ao fazer login:', error);
        res.status(500).send({ error: 'Erro ao fazer login', details: error });
    }
});


// Rota para solicitar recuperação de senha
router.post('/api/recover', async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).send({ error: 'Usuário não encontrado' });
        }

        // Aqui você deve gerar um token único e enviar um email ao usuário com o link
        // Por simplicidade, estamos apenas retornando uma mensagem.
        // No final, você deve usar um serviço de email (como Nodemailer).
        
        // Exemplo de token gerado (na prática, use um pacote para gerar tokens)
        const token = 'tokenGeradoAqui'; // Você deve gerar um token válido
        console.log(`Envie um email para ${email} com o link de recuperação que contém o token: ${token}`);

        res.send({ message: 'Instruções de recuperação de senha foram enviadas para seu email.' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao solicitar recuperação de senha', details: error });
    }
});

// Rota para redefinir a senha
router.post('/api/reset-password', async (req, res) => {
    const { token, novaSenha } = req.body;

    // Aqui, você deve verificar se o token é válido. Por simplicidade, estamos apenas fazendo um exemplo básico.
    if (!token) {
        return res.status(400).send({ error: 'Token inválido.' });
    }

    try {
        // Aqui você deve buscar o usuário associado ao token (não implementado neste exemplo)
        const usuario = await User.findOne({ /* condição para encontrar usuário pelo token */ });

        if (!usuario) {
            return res.status(400).send({ error: 'Usuário não encontrado.' });
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(novaSenha, 10);
        usuario.senha = hashedPassword;
        await usuario.save();

        res.send({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao redefinir a senha', details: error });
    }
});


module.exports = router;
