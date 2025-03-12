import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (isLoadMore = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://book-recommendation-system-9uba.onrender.com/api/postagens?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
  
      const postsData = await Promise.all(response.data.map(async (post) => {
        if (post.type === 'review' && !post.bookTitle) {
          try {
            let bookTitle = 'Libro desconocido';
            if (!post.bookId.includes('OL')) {
              const googleResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${post.bookId}`);
              bookTitle = googleResponse.data.volumeInfo?.title || bookTitle;
            } else {
              const openLibraryResponse = await axios.get(`https://openlibrary.org/works/${post.bookId}.json`);
              bookTitle = openLibraryResponse.data.title || bookTitle;
            }
            return { ...post, bookTitle };
          } catch (error) {
            console.error('Error al buscar el nombre del libro:', error);
          }
        }
        return post;
      }));
  
      setPosts((prevPosts) => (isLoadMore ? [...prevPosts, ...postsData] : postsData));
      setHasMore(response.data.length > 0);
    } catch (error) {
      console.error('Error al buscar publicaciones:', error);
    }
    setLoading(false);
  };

  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTime).toLocaleDateString('es-ES', options);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchPosts(page > 1);
  }, [page]);

  return (
    <Container className="feed-container" style={{ 
      width: '100vw',
      maxWidth: '1200px',
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      overflowX: 'hidden',
      backgroundColor: '#1c0101',
      color: 'white',
      fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
      paddingTop: '80px'
    }}>
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {loading && page === 1 ? (
          <Spinner animation="border" size="lg" />
        ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card className="post-card" key={post._id} style={{
                height: '250px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#1c0101',
                color: 'white',
                fontFamily: '"Baskerville", "Palatino Linotype", "Garamond", serif',
                border: '3px solid white',
                borderRadius: '10px',
                padding: '10px',
                marginTop: '20px'
              }}>
                <Card.Body style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Card.Title className="post-user" style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                    {post.userId?.name}
                  </Card.Title>

                  {post.type === 'review' && post.bookTitle && (
                    <Card.Subtitle className="post-book" style={{ fontSize: '16px', fontWeight: 'bold', color: '#444', display: 'flex', alignItems: 'center' }}>
                      {post.rating !== null && (
                        <span className="post-rating" style={{ color: '#f39c12', fontSize: '18px', marginRight: '8px' }}>
                          {'★'.repeat(post.rating) + '☆'.repeat(5 - post.rating)}
                        </span>
                      )}
                      <span>Reseña del libro:</span>
                      <Link to={`/book-review/${post.bookId}`} style={{ textDecoration: 'none', color: '#007BFF', marginLeft: '5px' }}>
                        {post.bookTitle}
                      </Link>
                    </Card.Subtitle>
                  )}


                  <Card.Text className="post-content" style={{ fontSize: '16px', color: 'white', flexGrow: 1, overflowY: 'auto', maxHeight: '150px', paddingRight: '10px' }}>
                    {post.content}
                  </Card.Text>

                  {post.type === 'review' && post.rating !== null && (
                  <div className="post-rating" style={{ color: '#f39c12', fontSize: '18px' }}>
                    {'★'.repeat(post.rating) + '☆'.repeat(5 - post.rating)}
                  </div>
                )}
                
                <Card.Text className="post-date" style={{ fontSize: '14px', color: 'white', marginTop: '10px' }}>
                  Publicado en: {formatDateTime(post.createdAt)}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="no-posts">No hay publicaciones para mostrar.</p>
        )}
      </div>
      {hasMore && (
        <Button className="load-more-btn" onClick={loadMore} disabled={loading} variant="success" size="lg" style={{ borderRadius: '25px', padding: '15px 20px', fontSize: '18px', marginTop: '20px' }}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Cargar Más'}
        </Button>
      )}
    </Container>
  );
};

export default Feed;
