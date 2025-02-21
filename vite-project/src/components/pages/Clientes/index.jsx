import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Button,
  SearchBar,
  Notification,
  Select,
  ActionIcon,
  ConfirmButton,
  ConfirmCancelButton
} from "../../../styles/utils";
import {
  ModalOverlay,
  ModalActions,
  ModalContent,
  FormContainer,
  FormGroup,
  DivHeader
} from './styles'
import InputMask from "react-input-mask";
import { FaEdit, FaTrash } from "react-icons/fa";

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: "",
    cpfCnpj: "",
    email: "",
    phone: "",
    address: "",
  });
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ type: "", text: "" });

  const estadosBrasil = [
    { sigla: "AC", nome: "Acre" },
    { sigla: "AL", nome: "Alagoas" },
    { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" },
    { sigla: "BA", nome: "Bahia" },
    { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" },
    { sigla: "ES", nome: "Espírito Santo" },
    { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" },
    { sigla: "MT", nome: "Mato Grosso" },
    { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" },
    { sigla: "PA", nome: "Pará" },
    { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" },
    { sigla: "PE", nome: "Pernambuco" },
    { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" },
    { sigla: "RN", nome: "Rio Grande do Norte" },
    { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" },
    { sigla: "RR", nome: "Roraima" },
    { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" },
    { sigla: "SE", nome: "Sergipe" },
    { sigla: "TO", nome: "Tocantins" }
  ];

  const showMessage = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: "", text: "" }), 3000);
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/clientes");
      const formattedClients = response.data.map((client) => ({
        id: client.id,
        name: client.nome,
        cpfCnpj: client.cpf_cnpj,
        email: client.email || "",
        phone: client.telefone || "",
        address: client.endereco || "",
        estado: client.estado || "",
        cidade: client.cidade || ""
      }));
      setClients(formattedClients);
    } catch (error) {
      showMessage("error", "Erro ao buscar clientes.");
      console.error("Erro ao buscar clientes:", error);
    }
  };


  useEffect(() => {
    fetchClients();
  }, []);

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setNewClient(clients[index]);
    } else {
      setEditingIndex(null);
      setNewClient({
        name: "",
        cpfCnpj: "",
        email: "",
        phone: "",
        address: "",
        estado: "",
        cidade: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  // 🔹 Formata CPF e CNPJ na exibição
  const formatCpfCnpj = (value) => {
    if (!value) return "";
    return value.length === 11
      ? value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") // CPF
      : value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"); // CNPJ
  };

  // 🔹 Formata telefone
  const formatPhone = (phone) => {
    if (!phone || phone.length < 10) return phone;
    return phone.length === 10
      ? phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3") // Telefone fixo
      : phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"); // Celular
  };

  // 🔹 Formata CEP
  const formatCep = (cep) => {
    if (!cep || cep.length !== 8) return cep;
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  // 🔹 Remove a formatação antes de enviar para API
  const removeMask = (value) => value.replace(/\D/g, "");


  const addOrUpdateClient = async () => {
    if (
      newClient.name &&
      newClient.cpfCnpj &&
      newClient.email &&
      newClient.phone &&
      newClient.address &&
      newClient.estado &&
      newClient.cidade
    ) {
      try {
        const payload = {
          nome: newClient.name,
          cpf_cnpj: removeMask(newClient.cpfCnpj),
          email: newClient.email,
          telefone: removeMask(newClient.phone),
          endereco: newClient.address,
          estado: newClient.estado,
          cidade: newClient.cidade
        };

        if (editingIndex !== null) {
          const clientToUpdate = clients[editingIndex];
          await axios.put(
            `http://127.0.0.1:5000/clientes/${clientToUpdate.id}`,
            payload
          );
          showMessage("success", "Cliente atualizado com sucesso!");
        } else {
          await axios.post("http://127.0.0.1:5000/clientes", payload);
          showMessage("success", "Cliente cadastrado com sucesso!");
        }

        fetchClients();
        closeModal();
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Erro ao salvar cliente.";
        showMessage("error", errorMessage);
      }
    } else {
      showMessage("error", "Todos os campos obrigatórios devem ser preenchidos.");
    }
  };
  

  const removeClient = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/clientes/${id}`);
      showMessage("success", "Cliente removido com sucesso!");
      fetchClients();
    } catch (error) {
      showMessage("error", "Erro ao remover cliente.");
      console.error("Erro ao remover cliente:", error);
    }
  };

  const filteredClients = clients.filter((client) => {
    const clientName = client.name || "";
    const clientCpfCnpj = client.cpfCnpj || "";

    return (
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      clientCpfCnpj.includes(search)
    );
  });

  return (
    <Container>
      <h1>Cadastro de Clientes</h1>
      <DivHeader>
        <Button onClick={() => openModal()}>Adicionar Cliente</Button>
        {notification.text && (
          <Notification type={notification.type}>{notification.text}</Notification>
        )}
        <SearchBar
          type="text"
          placeholder="Pesquisar por nome ou CPF/CNPJ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </DivHeader>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2>
              {editingIndex !== null
                ? "Editar Cliente"
                : "Adicionar Cliente"}
            </h2>
            <form>
              <FormContainer>
                <FormGroup>
                  <label>Nome:</label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <label>CPF/CNPJ:</label>
                  <InputMask
                    mask={newClient.cpfCnpj.length <= 11 ? "999.999.999-99" : "99.999.999/9999-99"}
                    value={newClient.cpfCnpj}
                    onChange={(e) => setNewClient({ ...newClient, cpfCnpj: e.target.value })}
                  >
                    {(inputProps) => (
                      <input {...inputProps} type="text" placeholder="Digite o CPF ou CNPJ" required />
                    )}
                  </InputMask>
                </FormGroup>

                <FormGroup>
                  <label>Email:</label>
                  <input
                    type="email"
                    placeholder="Digite o email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <label>Telefone:</label>
                  <InputMask
                    mask={newClient.phone.length > 10 ? "(99) 99999-9999" : "(99) 9999-9999"}
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  >
                    {(inputProps) => (
                      <input {...inputProps} type="text" placeholder="Digite o telefone" required />
                    )}
                  </InputMask>
                </FormGroup>
                <FormGroup>
                <label>Estado:</label>
                <Select
                  value={newClient.estado}
                  onChange={(e) => setNewClient({ ...newClient, estado: e.target.value })}
                  required
                >
                  <option value="">Selecione um Estado</option>
                  {estadosBrasil.map((estado) => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {estado.nome}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                  <label>Cidade:</label>
                  <input
                    type="text"
                    placeholder="Digite o Cidade"
                    value={newClient.cidade}
                    onChange={(e) =>
                      setNewClient({ ...newClient, cidade: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <label>Endereço:</label>
                  <input
                    type="text"
                    placeholder="Digite o endereço"
                    value={newClient.address}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: e.target.value })
                    }
                  />
                </FormGroup>
              </FormContainer>
            </form>
            <ModalActions>
              <ConfirmButton onClick={addOrUpdateClient}>
                {editingIndex !== null ? "Atualizar" : "Adicionar"}
              </ConfirmButton>
              <ConfirmCancelButton onClick={closeModal}>Cancelar</ConfirmCancelButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
      <Table>
        <thead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Nome</TableHeader>
            <TableHeader>CPF/CNPJ</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Telefone</TableHeader>
            <TableHeader>Endereço</TableHeader>
            <TableHeader>Ações</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {filteredClients.map((client, index) => (
            <TableRow key={index}>
              <TableCell>{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{formatCpfCnpj(client.cpfCnpj)}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{formatPhone(client.phone)}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell>
                <ActionIcon onClick={() => openModal(index)}>
                  <FaEdit size={16} style={{ color: "#FF9800" }} />
                </ActionIcon>
                <ActionIcon onClick={() => removeClient(client.id)}>
                  <FaTrash size={16} style={{ color: "#f43f5e" }} />
                </ActionIcon>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Clientes;
