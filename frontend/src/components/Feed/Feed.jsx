import { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (append = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/postagens?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setPosts((prevPosts) => append ? [...prevPosts, ...response.data] : response.data);
    } catch (error) {
      console.error('Erro ao buscar postagens:', error);
    }
    setLoading(false);
  };

  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTime).toLocaleDateString('pt-BR', options);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchPosts(page > 1);
  }, [page]);

  return (
    <Container className="feed-container" style={{ width: '100%', maxWidth: '1400px' }}>
      <CreatePost setPosts={setPosts} />
      {loading ? (
        <Spinner animation="border" size="lg" />
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Card className="post-card" key={post._id}>
            <Card.Body>
              <Card.Title className="post-user" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {post.userId?.name}
              </Card.Title>
              <Card.Text className="post-content" style={{ fontSize: '16px', color: '#555' }}>
                {post.content}
              </Card.Text>
              {post.image && (
                <Card.Img className="post-image" src={`/uploads/${post.image}`} alt="Post" />
              )}
              <Card.Text className="post-date" style={{ fontSize: '14px', color: '#777', marginTop: '10px' }}>
                Publicado em: {formatDateTime(post.createdAt)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="no-posts">Não há postagens para exibir.</p>
      )}
      <Button className="load-more-btn" onClick={loadMore} disabled={loading} variant="success" size="lg" style={{ borderRadius: '25px', padding: '15px 20px', fontSize: '18px' }}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Carregar Mais'}
      </Button>
    </Container>
  );
};

export default Feed;
