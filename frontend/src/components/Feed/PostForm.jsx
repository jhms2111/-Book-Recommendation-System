import { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!content) {
      setError('Conteúdo da postagem é obrigatório');
      return;
    }

    try {
      // Criando um FormData
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image); // Adiciona imagem se houver
      }

      // Enviar a postagem para o backend
      await axios.post('https://book-recommendation-system-9uba.onrender.com/api/postagens', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Passando o token de autenticação
          // Remova a linha 'Content-Type': 'multipart/form-data' - axios irá adicionar automaticamente
        },
      });

      setSuccess('Postagem criada com sucesso!');
      setContent('');
      setImage(null);
    } catch (err) {
      setError('Erro ao criar postagem');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Crie uma postagem</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="O que você está pensando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          cols="50"
        ></textarea>
        <br />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <br />
        <button type="submit">Postar</button>
      </form>
    </div>
  );
};

export default PostForm;
