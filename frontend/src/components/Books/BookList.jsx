import PropTypes from 'prop-types';
import './BookList.css';

const BookList = ({ books }) => {
  return (
    <div className="bookshelf">
      {books.map((book) => (
        <div key={book.id || book.key} className="book-item">
          <div className="book-cover">
            {book.thumbnail ? (
              <img src={book.thumbnail} alt={book.title} />
            ) : book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                alt={book.title}
                style={{ width: '100px', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/100x150.png?text=Sem+Capa"
                alt="Sem capa"
                style={{ width: '100px', height: '150px', objectFit: 'cover' }}
              />
            )}
          </div>
          <p className="book-title">{book.title}</p>
        </div>
      ))}
    </div>
  );
};

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      thumbnail: PropTypes.string,
      cover_i: PropTypes.number, // Adicionando o cover_i
    })
  ).isRequired,
};

export default BookList;
