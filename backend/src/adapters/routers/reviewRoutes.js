// src/adapters/routers/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { reviewController } = require('../../infrastructure/server'); // Ajuste conforme a inicialização

router.post('/reviews', (req, res) => reviewController.add(req, res));
router.get('/reviews/:bookId', (req, res) => reviewController.list(req, res));

module.exports = router;
