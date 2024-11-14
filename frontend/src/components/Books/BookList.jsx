// src/components/Books/BookList.jsx
import PropTypes from 'prop-types';
import './BookList.css';

const BookList = ({ books }) => {
  return (
    <div className="bookshelf">
      {books.map((book) => (
        <div key={book.id} className="book-item">
          <div className="book-cover">
            <img src={book.thumbnail} alt={book.title} />
          </div>
          <p className="book-title">{book.title}</p>
        </div>
      ))}
    </div>
  );
};

// Validação dos tipos de `books`
BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      thumbnail: PropTypes.string,
    })
  ).isRequired,
};

export default BookList;
