const express = require('express');
const bcrypt = require('bcryptjs'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para geração e verificação de tokens JWT
const User = require('../../../infrastructure/dataBase/models/User');
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

// ** RUTAS DE AUTENTICACIÓN **

// Registro de usuario
router.post('/api/usuarios', async (req, res) => {
    const { name, email, senha } = req.body;

    if (!name || !email || !senha) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios.' });
    }

    if (!validateEmail(email)) {
        return res.status(400).send({ error: 'Formato de correo electrónico inválido.' });
    }

    if (!isPasswordStrong(senha)) {
        return res.status(400).send({ error: 'Contraseña débil. Debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const usuario = new User({ name, email, senha: hashedPassword });
        await usuario.save();
        res.status(201).send({ message: '¡Usuario registrado con éxito!' });
    } catch (error) {
        res.status(400).send({ error: 'Error al registrar al usuario', details: error });
    }
});

// Inicio de sesión de usuario
router.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).send({ error: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(senha, usuario.senha);
        if (!match) {
            return res.status(400).send({ error: 'Contraseña incorrecta' });
        }

        // Generar un token JWT con id, name y email
        const token = jwt.sign(
            { id: usuario._id, name: usuario.name, email: usuario.email }, // Incluyendo name y email en el token
            process.env.JWT_SECRET,  // Usa la clave secreta definida en .env
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        res.send({ message: 'Inicio de sesión exitoso', token, usuario });
    } catch (error) {
        res.status(500).send({ error: 'Error al iniciar sesión', details: error });
    }
});

// ** RUTAS PARA RECUPERACIÓN DE CONTRASEÑA **

// Solicitar recuperación de contraseña
router.post('/api/recover', async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).send({ error: 'Usuario no encontrado' });
        }

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // El token expira en 15 minutos
        );

        console.log(`Envía un correo a ${email} con el token: ${token}`);
        res.send({ message: 'Instrucciones de recuperación de contraseña enviadas al correo.' });
    } catch (error) {
        res.status(500).send({ error: 'Error al solicitar recuperación de contraseña', details: error });
    }
});

// Restablecer contraseña
router.post('/api/reset-password', async (req, res) => {
    const { token, nuevaSenha } = req.body;

    if (!token) {
        return res.status(400).send({ error: 'Token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await User.findById(decoded.id);
        if (!usuario) {
            return res.status(400).send({ error: 'Usuario no encontrado.' });
        }

        const hashedPassword = await bcrypt.hash(nuevaSenha, 10);
        usuario.senha = hashedPassword;
        await usuario.save();

        res.send({ message: '¡Contraseña restablecida con éxito!' });
    } catch (error) {
        res.status(500).send({ error: 'Error al restablecer la contraseña', details: error });
    }
});

// ** RUTAS PARA LIBROS DEL USUARIO **

// Añadir libro a la lista del usuario
router.post('/api/user/books', authenticateUser, async (req, res) => {
    const { bookId, title, thumbnail, status } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ error: 'Usuario no encontrado' });

        user.books.push({ bookId, title, thumbnail, status });
        await user.save();

        res.status(201).json({ message: '¡Libro añadido con éxito!', books: user.books });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir libro.', details: error });
    }
});

// Buscar libros del usuario
router.get('/api/user/books', authenticateUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.status(200).json({ books: user.books });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar libros del usuario.', details: error });
    }
});

// Testear funcionamiento
router.get('/api/test', (req, res) => {
    res.send({ message: '¡Ruta de prueba funcionando!' });
});

// Eliminar libro de la lista del usuario
router.delete('/api/user/books/:bookId', authenticateUser, async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ error: 'Usuario no encontrado' });

        user.books = user.books.filter((book) => book.bookId !== bookId);
        await user.save();

        res.status(200).json({ message: '¡Libro eliminado con éxito!', books: user.books });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar libro.', details: error });
    }
});

module.exports = router;
