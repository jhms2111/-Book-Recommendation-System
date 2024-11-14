import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/${bookId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      }
    };
    fetchReviews();
  }, [bookId]);

  return (
    <div>
      <h3>Avaliações</h3>
      {reviews.length === 0 ? (
        <p>Sem avaliações para este livro.</p>
      ) : (
        reviews.map(review => (
          <div key={review.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', paddingBottom: '10px' }}>
            <p><strong>Nota:</strong> {review.rating}</p>
            <p><strong>Comentário:</strong> {review.comment}</p>
            <p><strong>Usuário:</strong> {review.userId?.name || 'Anônimo'}</p>
          </div>
        ))
      )}
    </div>
  );
};

// Defina os tipos esperados para `props`
ReviewList.propTypes = {
  bookId: PropTypes.string.isRequired,
};

export default ReviewList;
