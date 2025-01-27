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
  Notification
} from "../../../styles/utils";
import {ModalOverlay,
  ModalActions,
  ModalContent,
  FormContainer,
  FormGroup,
  DivHeader} from './styles'

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
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addOrUpdateClient = async () => {
    if (
      newClient.name &&
      newClient.cpfCnpj &&
      newClient.email &&
      newClient.phone &&
      newClient.address
    ) {
      try {
        const payload = {
          nome: newClient.name,
          cpf_cnpj: newClient.cpfCnpj,
          email: newClient.email,
          telefone: newClient.phone,
          endereco: newClient.address,
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
                  <input
                    type="text"
                    placeholder="Digite o CPF ou CNPJ"
                    value={newClient.cpfCnpj}
                    onChange={(e) =>
                      setNewClient({ ...newClient, cpfCnpj: e.target.value })
                    }
                  />
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
                  <input
                    type="text"
                    placeholder="Digite o telefone"
                    value={newClient.phone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
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
              <Button onClick={addOrUpdateClient}>
                {editingIndex !== null ? "Atualizar" : "Adicionar"}
              </Button>
              <Button onClick={closeModal}>Cancelar</Button>
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
              <TableCell>{client.cpfCnpj}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.address}</TableCell>

              <TableCell>
                <Button onClick={() => openModal(index)}>Editar</Button>
                <Button onClick={() => removeClient(client.id)}>Remover</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Clientes;
