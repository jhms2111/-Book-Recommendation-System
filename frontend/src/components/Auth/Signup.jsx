// src/components/Signup.js
import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('http://localhost:5000/api/usuarios', {
                name,
                email,
                senha,
            });
            setSuccess(response.data.message);
            // Resetar os campos após o sucesso
            setName('');
            setEmail('');
            setSenha('');
        } catch (err) {
            // Verificar se err.response está definido
            if (err.response && err.response.data) {
                setError(err.response.data.error);
            } else {
                // Caso não tenha uma resposta do servidor, exibir um erro genérico
                setError('Erro ao se conectar ao servidor. Tente novamente mais tarde.');
            }
        }
    };
    

    return (
        <div>
            <h2>Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                <button type="submit">Cadastrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default Signup;
