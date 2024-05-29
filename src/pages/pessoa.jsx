import { useState, useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

const Pessoa = () => {
  const [pessoas, setPessoas] = useState([]);
  const [novaPessoa, setNovaPessoa] = useState({
    id: 0,
    nome: '',
    sobrenome: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPessoaId, setEditingPessoaId] = useState(null);

  const fetchPessoas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pessoa');
      if (!response.ok) {
        throw new Error('Erro ao buscar as pessoas');
      }
      const data = await response.json();
      setPessoas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`http://localhost:3000/api/pessoa?id=${editingPessoaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novaPessoa),
        });
        if (!response.ok) {
          throw new Error('Erro ao atualizar a pessoa');
        }
        setIsEditing(false);
      } else {
        const response = await fetch('http://localhost:3000/api/pessoa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...novaPessoa, id: uuidv4() }),
        });
        if (!response.ok) {
          throw new Error('Erro ao criar a pessoa');
        }
      }
      fetchPessoas();
      setNovaPessoa({
        id: 0,
        nome: '',
        sobrenome: '',
        email: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPessoa = (pessoaId) => {
    const pessoaToEdit = pessoas.find(pessoa => pessoa.id === pessoaId);
    if (pessoaToEdit) {
      setNovaPessoa(pessoaToEdit);
      setIsEditing(true);
      setEditingPessoaId(pessoaId);
    } else {
      console.error('Pessoa não encontrada');
    }
  };

  const handleDeletePessoa = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pessoa?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar a pessoa');
      }
      fetchPessoas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Cadastro de Pessoas</h1>
      <h3>Acesse a URL da API aqui:</h3>
      <button><Link href="/api/pessoa">Pessoa</Link></button>
      <h3>Cadastrar Nova Pessoa</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={novaPessoa.nome}
          onChange={(e) => setNovaPessoa({ ...novaPessoa, nome: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={novaPessoa.sobrenome}
          onChange={(e) => setNovaPessoa({ ...novaPessoa, sobrenome: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={novaPessoa.email}
          onChange={(e) => setNovaPessoa({ ...novaPessoa, email: e.target.value })}
        />
        <br />
        <br />
        <button type="submit">{isEditing ? 'Atualizar Pessoa' : 'Cadastrar Pessoa'}</button>
      </form>
      
      <h3>Pessoas Cadastradas:</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>{pessoa.id}</td>
              <td>{pessoa.nome}</td>
              <td>{pessoa.sobrenome}</td>
              <td>{pessoa.email}</td>
              <td>
                <button onClick={() => handleEditPessoa(pessoa.id)}>Editar</button>
                <button onClick={() => handleDeletePessoa(pessoa.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Pessoa;
