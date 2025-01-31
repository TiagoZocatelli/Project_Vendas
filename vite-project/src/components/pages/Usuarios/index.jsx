import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {Container,Table} from '../../../styles/utils'
// Estilização dos componentes

const Button = styled.button`
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;

  ${(props) =>
    props.variant === "edit"
      ? "background-color: #f39c12;"
      : props.variant === "delete"
      ? "background-color: #e74c3c;"
      : "background-color: #2ecc71;"}

  &:hover {
    opacity: 0.8;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const UsuariosGerenciamento = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" ou "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    cargo: "",
    filial_id: "",
    nivel_acesso_id: "",
  });

  // 🔹 Carregar usuários ao abrir a página
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:5000/usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  // 🔹 Abrir Modal para Adicionar ou Editar Usuário
  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setFormData(
      user || {
        nome: "",
        cpf: "",
        email: "",
        senha: "",
        cargo: "",
        filial_id: "",
        nivel_acesso_id: "",
      }
    );
    setShowModal(true);
  };

  // 🔹 Fechar Modal
  const closeModal = () => {
    setShowModal(false);
  };

  // 🔹 Atualizar campos do formulário
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Criar ou Atualizar Usuário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      modalType === "add"
        ? "http://localhost:5000/usuarios"
        : `http://localhost:5000/usuarios/${selectedUser.id}`;
    const method = modalType === "add" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchUsuarios();
        closeModal();
      } else {
        console.error("Erro ao salvar usuário");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor", error);
    }
  };

  // 🔹 Excluir Usuário
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchUsuarios();
        } else {
          console.error("Erro ao excluir usuário");
        }
      } catch (error) {
        console.error("Erro ao conectar ao servidor", error);
      }
    }
  };

  return (
    <Container>
      <h1>Gerenciamento de Usuários</h1>
      <Button onClick={() => openModal("add")}>Adicionar Usuário</Button>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Filial</th>
            <th>Nível</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.cpf}</td>
              <td>{user.email}</td>
              <td>{user.cargo}</td>
              <td>{user.filial}</td>
              <td>{user.nivel_acesso}</td>
              <td>
                <Button variant="edit" onClick={() => openModal("edit", user)}>
                  Editar
                </Button>
                <Button variant="delete" onClick={() => handleDelete(user.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🔹 Modal de Cadastro e Edição */}
      {showModal && (
        <Modal>
          <ModalContent>
            <h2>{modalType === "add" ? "Adicionar Usuário" : "Editar Usuário"}</h2>
            <form onSubmit={handleSubmit}>
              <Input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleInputChange} required />
              <Input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleInputChange} required />
              <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
              <Input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleInputChange} required />
              <Input type="text" name="cargo" placeholder="Cargo" value={formData.cargo} onChange={handleInputChange} required />
              <Input type="number" name="filial_id" placeholder="ID Filial" value={formData.filial_id} onChange={handleInputChange} required />
              <Input type="number" name="nivel_acesso_id" placeholder="ID Nível Acesso" value={formData.nivel_acesso_id} onChange={handleInputChange} required />
              <Button type="submit">Salvar</Button>
              <Button variant="delete" onClick={closeModal}>Cancelar</Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UsuariosGerenciamento;
