const Postagem = require('../../models/postagemModel'); // Modelo de Postagem
const User = require('../../models/User'); // Modelo de Usuário

// Criar uma nova postagem
exports.createPost = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;  // Obtendo o userId do token
    const image = req.file ? req.file.filename : null;

    if (!content) {
        return res.status(400).json({ error: 'Conteúdo da postagem é obrigatório' });
    }

    try {
        // Cria a nova postagem associando o userId
        const postagem = new Postagem({
            userId,  // O userId vem do token
            content,
            image,
        });

        await postagem.save();

        // Populando o nome do usuário no objeto da postagem
        const populatedPost = await Postagem.findById(postagem._id).populate('userId', 'name');

        res.status(201).json(populatedPost);  // Retorna a postagem com o nome do usuário populado
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        res.status(500).json({ error: 'Erro ao criar postagem' });
    }
};

// Buscar postagens com paginação
exports.getPosts = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;

    try {
        const posts = await Postagem.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'name')  // Popula o campo 'userId' com o nome do usuário
            .sort({ createdAt: -1 });

        res.json(posts);  // Retorna as postagens com os nomes dos usuários
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ error: 'Erro ao buscar postagens' });
    }
};
