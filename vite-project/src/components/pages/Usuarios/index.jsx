import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ActionIcon, ConfirmButton, ConfirmCancelButton, Container, Select, Table } from '../../../styles/utils';
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import InputMask from "react-input-mask";

// Estilização dos componentes
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  width: 550px;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const BotoesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;



const UsuariosGerenciamento = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" ou "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [filiais, setFiliais] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    filial_id: "",
    nivel_acesso_id: "",
  });

  // 🔹 Carregar usuários, filiais e níveis ao abrir a página
  useEffect(() => {
    fetchFiliais();
    fetchNiveis();
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

  const fetchFiliais = async () => {
    try {
      const response = await fetch("http://localhost:5000/filiais");
      const data = await response.json();
      setFiliais(data);
    } catch (error) {
      console.error("Erro ao buscar filiais", error);
    }
  };

  const fetchNiveis = async () => {
    try {
      const response = await fetch("http://localhost:5000/niveis_acesso");
      const data = await response.json();
      setNiveis(data);
      console.log(data)
    } catch (error) {
      console.error("Erro ao buscar níveis de acesso", error);
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

  const removeMask = (value) => value.replace(/\D/g, ""); // Remove tudo que não for número

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 🔹 Remove máscara do CPF antes de enviar
    const dataToSend = {
      ...formData,
      cpf: removeMask(formData.cpf),
    };
  
    // 🔹 Validação antes de enviar
    const requiredFields = ["nome", "cpf", "email", "senha", "filial_id", "nivel_acesso_id"];
    const missingFields = requiredFields.filter(field => !dataToSend[field]);
  
    if (missingFields.length > 0) {
      console.error("⚠️ Campos faltando no frontend:", missingFields);
      return;
    }
  
    console.log("📌 Enviando para API:", dataToSend);
  
    const url =
      modalType === "add"
        ? "http://localhost:5000/usuarios"
        : `http://localhost:5000/usuarios/${selectedUser.id}`;
    const method = modalType === "add" ? "POST" : "PUT";
  
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
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

  const formatCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf; // Verifica se o CPF é válido
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };
  

  return (
    <Container>
      <h1>Gerenciamento de Usuários</h1>
      <ConfirmButton onClick={() => openModal("add")}>
        <FaPlus /> Adicionar Usuário
      </ConfirmButton>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
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
              <td>{formatCPF(user.cpf)}</td>
              <td>{user.email}</td>
              <td>{user.filial}</td>
              <td>{user.nivel_acesso}</td>
              <td>
                <ActionIcon variant="edit" onClick={() => openModal("edit", user)}>
                  <FaEdit size={16} style={{ color: "#FF9800" }} />
                </ActionIcon>

                <ActionIcon variant="delete" onClick={() => handleDelete(user.id)}>
                  <FaTrash size={16} style={{ color: "#f43f5e" }} />
                </ActionIcon>
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
              <InputMask
                mask="999.999.999-99"
                value={formData.cpf}
                onChange={handleInputChange}
              >
                {(inputProps) => <Input {...inputProps} name="cpf" placeholder="CPF" required />}
              </InputMask>
              <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
              <Input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleInputChange} required />


              <BotoesContainer>
                <Select name="filial_id" value={formData.filial_id} onChange={handleInputChange} required>
                  <option value="">Selecione a Filial</option>
                  {filiais.map((filial) => (
                    <option key={filial.id} value={filial.id}>{filial.nome}</option>
                  ))}
                </Select>

                <Select name="nivel_acesso_id" value={formData.nivel_acesso_id} onChange={handleInputChange} required>
                  <option value="">Selecione o Nível</option>
                  {niveis.map((nivel) => (
                    <option key={nivel.id} value={nivel.id}>{nivel.nivel}</option>
                  ))}
                </Select>
              </BotoesContainer>
              <BotoesContainer>
                <ConfirmButton type="submit">Salvar</ConfirmButton>
                <ConfirmCancelButton onClick={closeModal}>Cancelar</ConfirmCancelButton>
              </BotoesContainer>

            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UsuariosGerenciamento;
