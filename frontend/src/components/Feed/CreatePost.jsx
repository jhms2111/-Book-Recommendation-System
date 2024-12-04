import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';  // Importando PropTypes

const CreatePost = ({ setPosts }) => {  // Recebe a função setPosts como prop
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // FormData para enviar dados com imagem
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('image', image); // Se houver uma imagem, adiciona ao formulário
            }

            // Pega o token JWT do localStorage (onde ele foi salvo após o login)
            const token = localStorage.getItem('authToken');

            // Envia a requisição POST para criar uma nova postagem
            const response = await axios.post('http://localhost:5000/api/postagens', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Necessário para enviar imagens
                    Authorization: `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
                },
            });

            // Se a postagem for criada com sucesso
            setSuccess('Postagem criada com sucesso!');
            setContent(''); // Limpa o conteúdo
            setImage(null);  // Limpa a imagem

            // Adiciona a nova postagem diretamente ao estado
            setPosts(prevPosts => [response.data, ...prevPosts]);  // Adiciona a nova postagem no início da lista

        } catch (err) {
            setError('Erro ao criar postagem. Tente novamente.');
            console.error('Erro ao criar postagem:', err);
        }
    };

    return (
        <div>
            <h2>Criar uma nova postagem</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Escreva algo..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">Criar Postagem</button>
            </form>
        </div>
    );
};

// Validação das props
CreatePost.propTypes = {
    setPosts: PropTypes.func.isRequired,  // Garante que 'setPosts' é uma função obrigatória
};

export default CreatePost;
