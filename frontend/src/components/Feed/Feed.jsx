// //Feed.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost'; // Importe o componente CreatePost

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
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
          });

          setPosts(response.data);  // Atualiza o estado com as postagens
      } catch (error) {
          console.error('Erro ao buscar postagens:', error);
      }
      setLoading(false);
  };

  // Função para carregar mais postagens
  const loadMore = () => {
      setPage((prevPage) => prevPage + 1);  // Carrega mais postagens
  };

  // Efeito para carregar as postagens quando a página mudar
  useEffect(() => {
      fetchPosts();  // Chama a função para carregar as postagens
  }, [page]);

  return (
      <div>
          <CreatePost setPosts={setPosts} /> {/* Passando a função setPosts para o CreatePost */}

          {/* Renderiza as postagens */}
          {posts.length > 0 ? (
              posts.map((post) => (
                  <div key={post._id}>
                      <h3>{post.userId?.name}</h3> {/* Exibe o nome do usuário aqui */}
                      <p>{post.content}</p>
                      {post.image && <img src={`/uploads/${post.image}`} alt="Post" />}
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
