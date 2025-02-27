import PropTypes from 'prop-types';
import './BookList.css';

const BookList = ({ books }) => {
  return (
    <div className="bookshelf">
      {books.map((book) => {
        // Definindo a URL para o Google Books ou Open Library
        let bookLink = '';
        if (book.volumeInfo && book.volumeInfo.infoLink) {
          bookLink = book.volumeInfo.infoLink; // Google Books
        } else if (book.key) {
          bookLink = `https://openlibrary.org${book.key}`; // Open Library
        }

        return (
          <div key={book.id || book.key} className="book-item">
            <div className="book-cover">
              <a href={bookLink} target="_blank" rel="noopener noreferrer">
                <img
                  src={
                    book.volumeInfo?.imageLinks?.thumbnail ||
                    (book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                      : 'https://via.placeholder.com/100x150.png?text=Sem+Capa')
                  }
                  alt={book.title || 'Título Desconhecido'}
                  style={{
                    width: '100%',
                    maxWidth: '120px',
                    height: 'auto',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </a>
            </div>
            <p className="book-title">{book.title || 'Título Indisponível'}</p>
          </div>
        );
      })}
    </div>
  );
};


BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      title: PropTypes.string,
      thumbnail: PropTypes.string,
      cover_i: PropTypes.number,
    })
  ).isRequired,
};

export default BookList;
