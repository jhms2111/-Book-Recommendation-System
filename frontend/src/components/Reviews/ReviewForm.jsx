import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const BookList = ({ books }) => {
  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {book.thumbnail ? (
            <img
              src={book.thumbnail}
              alt={book.title || "Imagem não disponível"}
              style={{ marginRight: '10px', cursor: 'pointer', width: '50px', height: '75px' }}
              onClick={() => handleBookClick(book.id)}
            />
          ) : (
            <div style={{ width: '50px', height: '75px', marginRight: '10px', backgroundColor: '#ccc' }}></div>
          )}
          <div>
            <h3 onClick={() => handleBookClick(book.id)} style={{ cursor: 'pointer' }}>
              {book.title || "Título não disponível"}
            </h3>
            <p>{book.authors ? book.authors.join(', ') : "Autor desconhecido"}</p>
            <button onClick={() => window.open(book.previewLink, '_blank')} style={{ marginRight: '10px' }}>
              Ver no Google Books
            </button>
            <button onClick={() => handleBookClick(book.id)}>Ver Detalhes</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Defina a validação de tipos para o prop `books`
BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.string),
      thumbnail: PropTypes.string,
      previewLink: PropTypes.string,
    })
  ).isRequired,
};

export default BookList;
