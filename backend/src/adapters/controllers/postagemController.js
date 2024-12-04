// src/controllers/postagemController.js
const Postagem = require('../../models/postagemModel'); // Modelo de Postagem

// Criar uma nova postagem
exports.createPost = async (req, res) => {
    const { content } = req.body; // Conteúdo da postagem
    const userId = req.user.id; // ID do usuário autenticado (do token JWT)
    const image = req.file ? req.file.filename : null; // Se houver uma imagem, pega o nome do arquivo

    if (!content) {
        return res.status(400).json({ error: 'Conteúdo da postagem é obrigatório' }); // Verifica se o conteúdo foi enviado
    }

    try {
        // Cria a nova postagem
        const postagem = new Postagem({
            userId, // A postagem está associada ao usuário autenticado
            content,
            image,
        });

        await postagem.save(); // Salva a postagem no banco de dados
        res.status(201).json(postagem); // Retorna a postagem criada com sucesso
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        res.status(500).json({ error: 'Erro ao criar postagem' }); // Erro no servidor
    }
};



// Buscar postagens com paginação
// Controller de Postagem (postagemController.js)
exports.getPosts = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;

    console.time('QueryTime'); // Adiciona um timer para medir o tempo de execução da consulta

    try {
        const posts = await Postagem.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        console.timeEnd('QueryTime'); // Finaliza o timer e imprime o tempo de execução

        res.json(posts);
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ error: 'Erro ao buscar postagens' });
    }
};

