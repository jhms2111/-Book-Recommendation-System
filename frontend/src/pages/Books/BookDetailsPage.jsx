// src/pages/BookDetailsPage.js
import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/books/${bookId}`);
        setBook(response.data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os detalhes do livro.');
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchBookDetails();
  }, [bookId]);

  if (loading) return <p>Carregando detalhes do livro...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{book.title || 'Título não disponível'}</h1>
      <p>{book.description || 'Descrição não disponível'}</p>
      {book.thumbnail ? (
        <img src={book.thumbnail} alt={book.title} />
      ) : (
        <p>Imagem não disponível</p>
      )}
      <p><strong>Autor(es):</strong> {book.authors ? book.authors.join(', ') : 'Autor desconhecido'}</p>
      <p><strong>Páginas:</strong> {book.pageCount || 'Número de páginas não disponível'}</p>
    </div>
  );
};

export default BookDetailsPage;
