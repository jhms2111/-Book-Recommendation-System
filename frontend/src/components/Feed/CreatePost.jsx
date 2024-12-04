import { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [content, setContent] = useState(''); // Armazena o conteúdo da postagem
  const [image, setImage] = useState(null); // Armazena a imagem da postagem
  const [error, setError] = useState(''); // Mensagens de erro
  const [success, setSuccess] = useState(''); // Mensagens de sucesso

  // Função para enviar a postagem para o backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página

    if (!content) {
      setError('Conteúdo da postagem é obrigatório');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image); // Se houver uma imagem, anexa ao formulário
      }

      // Enviar a postagem para o backend
      const response = await axios.post('http://localhost:5000/api/postagens', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Necessário para enviar imagens
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Certifique-se de que o token de autenticação esteja correto
        }
      });

      // Caso a postagem seja criada com sucesso, limpa o formulário e exibe uma mensagem
      setSuccess('Postagem criada com sucesso!');
      setContent('');
      setImage(null); // Limpa o campo de imagem
      setError(''); // Limpa o erro
      console.log('Postagem criada:', response.data); // Log para verificar o que veio do backend
    } catch (error) {
      setError('Erro ao criar postagem. Tente novamente.');
      console.error('Erro ao criar postagem:', error);
    }
  };

  return (
    <div>
      <h2>Criar uma nova postagem</h2>

      {/* Exibe erro ou sucesso */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que você está pensando?"
          rows="4"
          cols="50"
        />

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

export default CreatePost;
