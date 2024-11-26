// src/pages/Books/BookSearchPage.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from '../../components/Books/BookList'; // Importando o componente da lista de livros
import { useLocation, useNavigate } from 'react-router-dom';

const BookSearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState(new URLSearchParams(location.search).get('q') || '');  // Query da URL
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Função para capturar o input de busca
    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };

    // Função para lidar com a busca
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search-books?q=${query}`);  // Navega para a URL com a query
        }
    };

    useEffect(() => {
        if (query) {
            searchBooks(query);
        }
    }, [query]);

    // Função de busca nas APIs
    const searchBooks = async (searchQuery) => {
        setLoading(true);
        setError('');
        try {
            const [googleBooksRes, openLibraryRes] = await Promise.all([
                axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=10`),
                axios.get(`https://openlibrary.org/search.json?q=${searchQuery}`)
            ]);

            const googleBooks = googleBooksRes.data.items || [];
            const openLibraryBooks = openLibraryRes.data.docs || [];

            // Combina os livros de ambas as APIs
            const combinedBooks = [
                ...googleBooks.map((book) => ({
                    id: book.id,
                    title: book.volumeInfo.title,
                    authors: book.volumeInfo.authors || ['Desconhecido'],
                    thumbnail: book.volumeInfo.imageLinks?.thumbnail,
                    previewLink: book.volumeInfo.previewLink,
                })),
                ...openLibraryBooks.map((book) => ({
                    id: book.key.replace('/works/', ''),
                    title: book.title,
                    authors: book.author_name || ['Desconhecido'],
                    thumbnail: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '',
                    previewLink: `https://openlibrary.org${book.key}`,
                }))
            ];

            setBooks(combinedBooks);
        
            setError('Erro ao buscar livros.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Resultados da Busca</h1>
            
            {/* Formulário de busca */}
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Digite o nome do livro"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {/* Exibição de erros */}
            {error && <p>{error}</p>}

            {/* Exibição de livros */}
            {loading && <p>Carregando...</p>}
            <BookList books={books} />
        </div>
    );
};

export default BookSearchPage;
