// //CreatePost.jsx
import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import './Feed.css';

const CreatePost = ({ setPosts }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            const token = localStorage.getItem('authToken');
            const response = await axios.post('https://book-recommendation-system-9uba.onrender.com/api/postagens', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess('Postagem criada com sucesso!');
            setContent('');
            setImage(null);
            setPosts((prevPosts) => [response.data, ...prevPosts]);
        } catch (err) {
            setError('Erro ao criar postagem. Tente novamente.');
            console.error('Erro ao criar postagem:', err);
        }
    };

    return (
        <Container className="create-post-container">
            <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Criar uma nova postagem</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} className="create-post-form">
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={6}
                        placeholder="Escreva algo..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ fontSize: '18px', padding: '20px', borderRadius: '12px', border: '1px solid #ced4da', resize: 'none' }}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold', fontSize: '16px' }}>Selecione uma imagem</Form.Label>
                    <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    style={{ width: '100%', padding: '15px', fontSize: '20px', fontWeight: 'bold', borderRadius: '12px', background: '#007bff', border: 'none' }}
                >
                    Criar Postagem
                </Button>
            </Form>
        </Container>
    );
};

CreatePost.propTypes = {
    setPosts: PropTypes.func.isRequired,
};

export default CreatePost;