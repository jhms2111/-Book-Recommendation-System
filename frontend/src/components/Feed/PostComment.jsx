import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Importando PropTypes para validação

const PostComment = ({ postId }) => {
    const [comments, setComments] = useState([]);

    // Função para buscar os comentários de uma postagem
    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/postagens/${postId}/comments`);
            
            // Se não houver comentários, adicionar um comentário fixo
            if (response.data.length === 0) {
                setComments([{ content: 'Seja o primeiro a comentar!' }]);
            } else {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments(postId);
        }
    }, [postId]);

    return (
        <div>
            {comments.length === 0 ? (
                <p>Não há comentários para exibir.</p> // Se não houver comentários
            ) : (
                comments.map((comment, index) => (
                    <div key={index}>
                        <p>{comment.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

// Validando o tipo da propriedade 'postId'
PostComment.propTypes = {
    postId: PropTypes.string.isRequired, // postId deve ser uma string e é obrigatório
};

export default PostComment;
