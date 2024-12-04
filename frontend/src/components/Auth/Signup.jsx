import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [nomeCadastrado, setNomeCadastrado] = useState('');  // Estado para armazenar o nome do cadastro
    const [email, setEmail] = useState('');  // Estado para armazenar o email do usuário
    const [senha, setSenha] = useState('');  // Estado para armazenar a senha
    const [error, setError] = useState('');  // Estado para armazenar erros
    const [success, setSuccess] = useState('');  // Estado para armazenar mensagem de sucesso

    const handleSubmit = async (e) => {
        e.preventDefault();  // Evita o comportamento padrão do formulário (recarga da página)
        setError('');  // Limpa qualquer erro anterior
        setSuccess('');  // Limpa qualquer mensagem de sucesso anterior
    
        try {
            // Envia os dados do formulário para a API
            const response = await axios.post('http://localhost:5000/api/usuarios', {
                nomeCadastrado,
                email,
                senha,
            });
            

            // Se o cadastro for bem-sucedido, mostra a mensagem de sucesso
            setSuccess(response.data.message);

            // Resetar os campos após o sucesso
            setNomeCadastrado('');
            setEmail('');
            setSenha('');
        } catch (err) {
            if (err.response && err.response.data) {
                console.error('Erro retornado pelo servidor:', err.response.data); // Adiciona um log para exibir o erro
                setError(err.response.data.error); // Exibe a mensagem de erro na interface
            } else {
                console.error('Erro ao se conectar ao servidor', err); // Exibe o erro de rede, caso não tenha resposta
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
                    placeholder="Nome"
                    value={nomeCadastrado}  // Valor controlado pelo estado nomeCadastrado
                    onChange={(e) => setNomeCadastrado(e.target.value)}  // Atualiza o estado ao digitar
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Atualiza o estado ao digitar
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}  // Atualiza o estado ao digitar
                    required
                />
                <button type="submit">Cadastrar</button>
            </form>

            {/* Exibe a mensagem de erro, se houver */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Exibe a mensagem de sucesso, se houver */}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default Signup;
