// src/routes/postagensRoutes.js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });  // Defina o diretório de destino para o upload de arquivos

const express = require('express');
const postagemController = require('../controllers/postagemController');
const authenticateUser = require('../../adapters/controllers/middleware/authenticateUser'); // Middleware de autenticação

const router = express.Router();

// Criar postagem (rota protegida)
router.post('/postagens', authenticateUser, upload.single('image'), postagemController.createPost);

// Buscar postagens com paginação
router.get('/postagens', postagemController.getPosts);


module.exports = router;
