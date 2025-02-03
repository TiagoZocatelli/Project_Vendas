import React, { useState, useEffect } from "react";
import api from "../../../api";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck } from "react-icons/fa";
import {
  Title,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Container,
} from "./styles";
import {
  Table,
  Input,
  Select, // Novo componente estilizado para o select
  TableHeader,
  TableRow,
  TableCell,
  ActionIcon,
  ConfirmModalContainer,
  ConfirmModalContent,
  ConfirmButtonContainer,
  ConfirmButton,
  ConfirmCancelButton,
} from "../../../styles/utils";
import InputMask from "react-input-mask";

const Operadores = () => {
  const [operadores, setOperadores] = useState([]);
  const [filiais, setFiliais] = useState([]);  // 🔹 Lista de filiais
  const [selectedFilial, setSelectedFilial] = useState(""); // 🔹 Filial selecionada para filtro
  const [search, setSearch] = useState(""); // 🔹 Campo de busca por nome
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    cargo: "Vendedor",
    filial_id: "", // 🔹 Novo campo para filial
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(null);
  const [notification, setNotification] = useState({ type: "", text: "" });



  // 🔹 Exibe uma notificação
  const showMessage = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: "", text: "" }), 3000); // Remove após 3s
  }

  // 🔹 Carrega operadores da API
  useEffect(() => {
    fetchOperadores();
    fetchFiliais();
  }, []);

  const fetchOperadores = async () => {
    try {
      const response = await api.get("/operadores");
      setOperadores(response.data);
      console.log(response.data)
    } catch (error) {
      showMessage("Erro ao buscar operadores:", error);
    }
  };

  const fetchFiliais = async () => {
    try {
      const response = await api.get("/filiais");
      setFiliais(response.data);
    } catch (error) {
      showMessage("error", "Erro ao buscar filiais.");
    }
  };

  // 🔹 Atualiza os campos do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Cadastra operador ou solicita confirmação de edição
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      setConfirmEdit(true); // Mostra modal de confirmação para edição
    } else {
      await saveOperador(); // Salva direto se for um novo operador
    }
  };

  // 🔹 Confirma edição e salva no banco
  const confirmEditAction = async () => {
    if (editId) {
      try {
        await api.put(`/operadores/${editId}`, formData);
        fetchOperadores();
        closeModal();
      } catch (error) {
        showMessage("Erro ao atualizar operador:", error);
      }
    }
  };

  // 🔹 Salva operador no banco
  const saveOperador = async () => {
    try {
      await api.post("/operadores", formData);
      fetchOperadores();
      closeModal();
    } catch (error) {
      showMessage("Erro ao salvar operador:", error);
    }
  };

  const handleEdit = (operador) => {
    setFormData({
      nome: operador.nome,
      cpf: operador.cpf,
      email: operador.email,
      senha: "",
      cargo: operador.cargo,
      filial_id: operador.filial_id, // 🔹 Preenche a filial na edição
    });
    setEditId(operador.id);
    setIsModalOpen(true);
  };

  // 🔹 Abre o modal de exclusão
  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  // 🔹 Confirma exclusão
  const confirmDeleteAction = async () => {
    if (confirmDelete) {
      try {
        await api.delete(`/operadores/${confirmDelete}`);
        fetchOperadores();
        setConfirmDelete(null);
      } catch (error) {
        console.error("Erro ao excluir operador:", error);
      }
    }
  };

 // 🔹 Abre o modal de cadastro
 const openModal = () => {
  setFormData({ nome: "", cpf: "", email: "", senha: "", cargo: "Vendedor", filial_id: "" });
  setEditId(null);
  setIsModalOpen(true);
};

  // 🔹 Fecha os modais
  const closeModal = () => {
    setIsModalOpen(false);
    setConfirmDelete(null);
    setConfirmEdit(null);
  };

  const formatCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf; // Verifica se o CPF é válido
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };
  

  return (
    <Container>

      {/* Notificações */}
      {notification.text && (
        <Notification type={notification.type}>{notification.text}</Notification>
      )}
      <Title>Gerenciar Operadores</Title>

      {/* Botão de Adicionar Novo Operador */}
      <ConfirmButton onClick={openModal}>
        <FaPlus /> Novo Operador
      </ConfirmButton>

      <Table>
        <thead>
          <tr>
            <TableHeader>Codigo</TableHeader>
            <TableHeader>Nome</TableHeader>
            <TableHeader>CPF</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Cargo</TableHeader>
            <TableHeader>Filial</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {operadores.map((operador) => (
            <TableRow key={operador.id}>
              <TableCell>{operador.id}</TableCell>
              <TableCell>{operador.nome}</TableCell>
              <TableCell>{formatCPF(operador.cpf)}</TableCell>
              <TableCell>{operador.email}</TableCell>
              <TableCell>{operador.cargo}</TableCell>
              <TableCell>{operador.filial}</TableCell>
              <TableCell>
                <ActionIcon onClick={() => handleEdit(operador)}>
                  <FaEdit size={16} style={{ color: "#FF9800" }} />
                </ActionIcon>
                <ActionIcon onClick={() => handleDelete(operador.id)}>
                  <FaTrash size={16} style={{ color: "#f43f5e" }} />
                </ActionIcon>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>{editId ? "Editar Operador" : "Cadastrar Operador"}</ModalTitle>
            <form onSubmit={handleSubmit}>
              <Input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
              <InputMask
                mask="999.999.999-99"
                value={formData.cpf}
                onChange={handleChange}
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    type="text"
                    name="cpf"
                    placeholder="CPF"
                    required
                  />
                )}
              </InputMask>
              <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <Input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required={!editId} />

              {/* 🔹 Select para cargos com opções fixas */}
              <Select name="cargo" value={formData.cargo} onChange={handleChange} required>
                <option value="Vendedor">Vendedor</option>
                <option value="Gerente">Gerente</option>
                <option value="Caixa">Caixa</option>
              </Select>

              <Select name="filial_id" value={formData.filial_id} onChange={handleChange} required>
                <option value="">Selecione a Filial</option>
                {filiais.map((filial) => (
                  <option key={filial.id} value={filial.id}>{filial.nome}</option>
                ))}
              </Select>

              <ConfirmButtonContainer>
                <ConfirmButton type="submit">
                  <FaCheck /> Salvar
                </ConfirmButton>
                <ConfirmCancelButton onClick={closeModal}>
                  <FaTimes /> Cancelar
                </ConfirmCancelButton>
              </ConfirmButtonContainer>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Confirmação para Exclusão */}
      {confirmDelete && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Deseja realmente excluir?</h2>
            <p>Essa ação não poderá ser desfeita.</p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={confirmDeleteAction}>Confirmar</ConfirmButton>
              <ConfirmCancelButton onClick={closeModal}>Cancelar</ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}

      {/* Modal de Confirmação para Edição */}
      {confirmEdit && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Deseja confirmar a alteração?</h2>
            <p>As informações do operador serão modificadas.</p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={confirmEditAction}>Confirmar</ConfirmButton>
              <ConfirmCancelButton onClick={closeModal}>Cancelar</ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}
    </Container>
  );
};

export default Operadores;
