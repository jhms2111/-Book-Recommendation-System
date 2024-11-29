// postagemController.js
const Postagem = require('../../models/postagemModel'); // Certifique-se de que o caminho do modelo está correto
const Comment = require('../../models/commentModel'); // Certifique-se de que o caminho do modelo está correto

// Função para criar uma postagem
// No seu controlador de criação de postagem:
exports.createPost = async (req, res) => {
    const { content, userId, image } = req.body;

    try {
        const newPost = new Postagem({ content, userId, image });

        // Adiciona um comentário fixo na criação da postagem
        const fixedComment = {
            userId: userId, // Pode ser o mesmo usuário ou um ID fixo
            content: "Seja o primeiro a comentar!" // Comentário fixo
        };
        
        // Salva a postagem com o comentário fixo
        newPost.comments.push(fixedComment);

        await newPost.save();
        res.status(201).json(newPost); // Retorna o post criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar postagem', details: error.message });
    }
};

// Buscar postagens com base no ID
exports.getPosts = async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Padrão para página 1 e limite de 5 postagens

  try {
    const posts = await Postagem.find()
      .skip((page - 1) * limit) // Pula as postagens já retornadas na página anterior
      .limit(Number(limit)) // Limita o número de postagens
      .populate('userId', 'name'); // Popula os dados do usuário (como nome)

    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
    res.status(500).json({ error: 'Erro ao buscar postagens' });
  }
};

// Buscar postagens pelo ID
exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Postagem.findById(postId).populate('userId', 'name');
    if (!post) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }
    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar postagem:', error);
    res.status(500).send('Erro ao buscar postagem');
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

// Buscar comentários de uma postagem
exports.getComments = async (req, res) => {
  const { id } = req.params; // Pegando o id da postagem da URL

  try {
    const post = await Postagem.findById(id); // Verifica se a postagem existe
    if (!post) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }

    // Se a postagem existir, retorna os comentários dela
    res.json(post.comments); // Aqui vamos usar `post.comments`, que é o array de comentários já dentro da postagem
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comentários', details: error.message });
  }
};
