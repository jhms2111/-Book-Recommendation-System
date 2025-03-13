const Postagem = require('../../models/postagemModel'); // Modelo de Postagem
const User = require('../../models/User'); // Modelo de Usuário
const axios = require('axios');

// Criar uma nova postagem
const createPost = async (req, res) => { // 👈 Defina createPost ANTES de exportar
    const { content, type, bookId, bookTitle, rating } = req.body;
    const userId = req.user.id;  // Obtendo o userId do token

    if (!content) {
        return res.status(400).json({ error: 'Conteúdo da postagem é obrigatório' });
    }

    try {
        const postagem = new Postagem({
            userId,
            content,
            type: type || 'post',
            bookId: type === 'review' ? bookId : null,
            bookTitle: type === 'review' ? bookTitle : null, // 🔥 Agora garantimos que o título seja salvo!
            rating: type === 'review' ? rating : null
        });

        await postagem.save();

        console.log("✅ Postagem salva no MongoDB:", postagem); // 🔍 Log para depuração

        const populatedPost = await Postagem.findById(postagem._id).populate('userId', 'name');
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('❌ Erro ao criar postagem:', error);
        res.status(500).json({ error: 'Erro ao criar postagem' });
    }
};

// Buscar postagens com paginação
const getPosts = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;

    try {
        const posts = await Postagem.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'name') // Popula o nome do usuário
            .sort({ createdAt: -1 });

        // 🔥 Buscar o nome do livro para postagens de review
        const updatedPosts = await Promise.all(posts.map(async (post) => {
            if (post.type === 'review' && post.bookId) {
                try {
                    let bookTitle = 'Livro desconhecido';

                    if (!post.bookId.includes('OL')) {
                        // 🔍 Buscar na API do Google Books
                        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${post.bookId}`);
                        bookTitle = response.data.volumeInfo.title || bookTitle;
                    } else {
                        // 🔍 Buscar na API do Open Library
                        const response = await axios.get(`https://openlibrary.org/works/${post.bookId}.json`);
                        bookTitle = response.data.title || bookTitle;
                    }

                    return { ...post.toObject(), bookTitle }; // 🔥 Adiciona o nome do livro à resposta
                } catch (error) {
                    console.error('Erro ao buscar detalhes do livro:', error);
                    return { ...post.toObject(), bookTitle: 'Erro ao carregar título' };
                }
            }
            return post.toObject();
        }));

        res.json(updatedPosts);
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ error: 'Erro ao buscar postagens' });
    }
};

// Ranking dos melhores livros
const getTopRatedBooks = async (req, res) => {
    try {
        const topBooks = await Postagem.aggregate([
            { 
                $match: { type: 'review', rating: { $ne: null } } // Filtra apenas avaliações com nota
            },
            { 
                $group: {
                    _id: { bookId: "$bookId", bookTitle: "$bookTitle" }, // Agrupa por ID do livro e título
                    avgRating: { $avg: "$rating" }, // Calcula a média das avaliações
                    count: { $sum: 1 } // Conta quantas avaliações cada livro recebeu
                }
            },
            { $sort: { avgRating: -1, count: -1 } }, // Ordena primeiro pela nota média, depois pela quantidade de avaliações
            { $limit: 10 } // Retorna os 10 melhores
        ]);

        res.json(topBooks);
    } catch (error) {
        console.error("❌ Erro ao buscar ranking:", error);
        res.status(500).json({ error: "Erro ao buscar ranking dos livros" });
    }
};


// Buscar todas as avaliações de um livro específico
const getBookReviews = async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await Postagem.find({ bookId, type: 'review' })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error("Erro ao buscar reviews do livro:", error);
        res.status(500).json({ error: "Erro ao buscar reviews do livro" });
    }
};





const deletePost = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;

        const deletedPost = await Postagem.findByIdAndDelete(id);
        if (!deletedPost) {
            console.error("❌ ERRO: Nenhuma postagem encontrada para excluir.");
            return null;
        }

        return deletedPost;
    } catch (error) {
        console.error("❌ Erro ao excluir postagem no banco:", error);
        return null;
    }
};








// 📌 Agora inclua a função na exportação
module.exports = {
    createPost,
    getPosts,
    getTopRatedBooks,
    deletePost,
    getBookReviews,  // ✅ Adicione essa linha
};