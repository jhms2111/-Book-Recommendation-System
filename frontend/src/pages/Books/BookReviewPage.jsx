import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Rating } from '@mui/material';

const BookReviewPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [isPageCreated, setIsPageCreated] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const isGoogleBook = !bookId.includes('OL');

        if (isGoogleBook) {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
          const data = await response.json();

          setBookDetails({
            title: data.volumeInfo.title || 'Título no disponible',
            description: data.volumeInfo.description || 'No hay resumen disponible.',
            authors: data.volumeInfo.authors || ['Desconocido'],
            publisher: data.volumeInfo.publisher || 'Desconocida',
            publishedDate: data.volumeInfo.publishedDate || 'Desconocida',
            pageCount: data.volumeInfo.pageCount || 'Desconocido',
            imageLinks: data.volumeInfo.imageLinks,
            link: data.volumeInfo.infoLink || data.volumeInfo.previewLink || null,
          });
        } else {
          const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
          const data = await response.json();

          setBookDetails({
            title: data.title || 'Título no disponible',
            description: data.description?.value || data.description || 'No hay resumen disponible.',
            authors: data.authors ? await Promise.all(
              data.authors.map(async (author) => {
                const authorResponse = await fetch(`https://openlibrary.org${author.author.key}.json`);
                const authorData = await authorResponse.json();
                return authorData.name;
              })
            ) : ['Desconocido'],
            publisher: 'Open Library',
            publishedDate: data.created?.value || 'Desconocida',
            pageCount: data.pages || 'Desconocido',
            imageLinks: {
              thumbnail: `https://covers.openlibrary.org/b/id/${data.covers?.[0]}-M.jpg`,
            },
            link: `https://openlibrary.org${data.key}`,
          });
        }
      } catch (error) {
        console.error('Error al obtener detalles del libro:', error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleAddToUserPage = async (status) => {
    try {
      const token = localStorage.getItem("authToken");

      console.log("🔍 Enviando token en la solicitud:", token);

      if (!token) {
        alert("Usuario no autenticado. Por favor, inicie sesión nuevamente.");
        return;
      }

      const bookData = {
        bookId,
        title: bookDetails.title,
        thumbnail: bookDetails.imageLinks?.thumbnail || '',
        status,
      };

      const response = await axios.post("https://book-recommendation-system-9uba.onrender.com/api/books", bookData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Libro añadido con éxito!", response.data);

      if (response.status === 201) {
        alert("¡Libro añadido con éxito!");
        navigate("/my-books");
      }
    } catch (error) {
      console.error("❌ Error al añadir el libro:", error.response ? error.response.data : error);
      alert("Error al añadir el libro. Intente nuevamente.");
    }
  };

  const handleSubmitReview = async () => {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('Usuario no autenticado.');
            return;
        }

        const reviewData = {
            content: comment,
            bookId,
            bookTitle: bookDetails.title, // 🔥 Ahora enviamos el nombre del libro correctamente!
            rating,
            type: 'review'
        };

        console.log("📩 Enviando reseña:", reviewData); // 🔍 Log para verificación

        await axios.post('https://book-recommendation-system-9uba.onrender.com/api/postagens', reviewData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        alert('¡Comentario y evaluación enviados con éxito!');
        setComment('');
        setRating(0);
    } catch (error) {
        console.error('❌ Error al enviar la evaluación:', error);
        alert('Error al enviar la evaluación. Intente nuevamente.');
    }
};

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', marginTop: '95px' }}>
      {!isPageCreated ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            ¿Listo para escribir una reseña y valorar el libro?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsPageCreated(true)}
            sx={{ marginTop: '20px' }}
          >
            Hacer una valoración
          </Button>
        </Box>
      ) : (
        <Box>
          
          <img
            src={bookDetails.imageLinks?.thumbnail || ''}
            alt={bookDetails.title}
            style={{ height: '200px', margin: '20px 0' }}
          />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '10px' }}>
            {bookDetails.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {bookDetails.description}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Autores:</strong> {bookDetails.authors?.join(', ') || 'Desconocido'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Editorial:</strong> {bookDetails.publisher || 'Desconocida'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Fecha de publicación:</strong> {bookDetails.publishedDate || 'Desconocida'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Número de Páginas:</strong> {bookDetails.pageCount || 'Desconocido'}
          </Typography>

          {/* Botón "Guardar Libro" */}
          <Box sx={{ marginTop: '20px' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAddToUserPage('Lido')}
            >
              Guardar libro
            </Button>
          </Box>

          {/* Botón para acceder al enlace del libro */}
          {bookDetails.link && (
            <Box sx={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(bookDetails.link, '_blank')}
              >
                Leer el libro
              </Button>
            </Box>
          )}

          {/* Espacio para comentario y evaluación */}
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h6">Deja tu comentario:</Typography>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            <Typography variant="h6">Valora el libro:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: '20px' }}
              onClick={handleSubmitReview} // ✅ Ahora la función es usada correctamente
            >
              Enviar evaluación
            </Button>

          </Box>

          {/* Botón de volver para la página inicial */}
          <Box sx={{ marginTop: '40px' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/')}
            >
              Volver a la página de inicio
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BookReviewPage;
