import { useState, useEffect } from 'react';
import axios from 'axios';
import PostComment from './PostComment'; // Importe o componente PostComment
import CreatePost from './CreatePost.jsx'; // Importe o novo componente CreatePost

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Função para buscar postagens da API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/postagens?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Token do usuário autenticado
        },
      });

      // Garantir que não haja postagens duplicadas ao carregar mais postagens
      const newPosts = response.data;

      setPosts((prevPosts) => {
        const combinedPosts = [...prevPosts, ...newPosts];
        // Filtrar postagens duplicadas com base no _id
        const uniquePosts = combinedPosts.filter(
          (value, index, self) => index === self.findIndex((t) => t._id === value._id)
        );
        return uniquePosts;
      });
    } catch (error) {
      console.error('Erro ao buscar postagens:', error);
    }
    setLoading(false);
  };

  // Função para curtir uma postagem
  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/postagens/${postId}/like`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Token do usuário
        },
      });
      // Atualiza a lista de postagens com as curtidas
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Erro ao curtir a postagem:', error);
    }
  };

  // Função para carregar mais postagens
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1); // Carrega mais postagens
  };

  // Efeito para carregar as postagens quando a página mudar
  useEffect(() => {
    fetchPosts(); // Chama a função para carregar as postagens
  }, [page]); // Recarrega as postagens quando a página mudar

  return (
    <div>
      <CreatePost /> {/* Formulário de criar postagem */}

      {/* Renderiza as postagens */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={`${post._id}-${post.userId._id}`}> {/* Chave única usando _id da postagem e do usuário */}
            <h3>{post.userId.name}</h3>
            <p>{post.content}</p>
            {post.image && <img src={`/uploads/${post.image}`} alt="Post" />}
            <button onClick={() => handleLike(post._id)}>
              {post.likes && post.likes.includes(localStorage.getItem('userId')) ? 'Descurtir' : 'Curtir'}
            </button>

            {/* Comentários */}
            <PostComment postId={post._id} /> {/* Exibe o componente de comentários */}
          </div>
        ))
      ) : (
        <p>Não há postagens para exibir.</p>
      )}

      {/* Botão para carregar mais postagens */}
      <button onClick={loadMore} disabled={loading}>
        {loading ? 'Carregando...' : 'Carregar Mais'}
      </button>
    </div>
  );
};

export default Feed;
