const Postagem = require('../../models/postagemModel');
const User = require('../../models/User'); // Importa o modelo de User

// Criar uma nova postagem
exports.createPost = async (req, res) => {
    const { content, image } = req.body;
    const userId = req.user.id; // Obtém o ID do usuário autenticado

    if (!content) {
        return res.status(400).json({ error: 'Conteúdo da postagem é obrigatório' });
    }

    try {
        const postagem = new Postagem({
            userId, // A postagem está associada ao usuário autenticado
            content,
            image, // Se houver uma imagem, ela será incluída aqui
        });

        await postagem.save();
        res.status(201).json(postagem); // Retorna a postagem criada com sucesso
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        res.status(500).json({ error: 'Erro ao criar postagem' });
    }
};

// Buscar postagens com paginação
exports.getPosts = async (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Defina a página e o limite

    try {
        const posts = await Postagem.find()
            .skip((page - 1) * limit) // Paginação
            .limit(limit)
            .populate('userId', 'name') // Popula o nome do usuário que fez a postagem
            .sort({ createdAt: -1 }); // Ordena por data de criação, mais recente primeiro

        res.json(posts); // Retorna as postagens
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ error: 'Erro ao buscar postagens' });
    }
};

// Curtir postagem
exports.likePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await Postagem.findById(postId);

        if (!post.likes.includes(userId)) {
            post.likes.push(userId); // Adiciona o like
        } else {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString()); // Remove o like
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Erro ao curtir a postagem:', error);
        res.status(500).json({ error: 'Erro ao curtir a postagem' });
    }
};

// Adicionar comentário
exports.addComment = async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        const post = await Postagem.findById(postId);
        post.comments.push({ userId, content });
        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        res.status(500).json({ error: 'Erro ao adicionar comentário' });
    }
};
