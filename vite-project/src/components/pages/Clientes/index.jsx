import { useState } from "react";
import {
  Container,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  AddForm,
  Input,
  Button,
  SearchBar,
} from "./styles";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const addOrUpdateClient = () => {
    if (
      newClient.name &&
      newClient.cpfCnpj &&
      newClient.email &&
      newClient.phone &&
      newClient.address
    ) {
      const updatedClients = [...clients];
      if (editingIndex !== null) {
        updatedClients[editingIndex] = newClient;
        setEditingIndex(null);
      } else {
        updatedClients.push(newClient);
      }
      setClients(updatedClients);
      setNewClient({ name: "", cpfCnpj: "", email: "", phone: "", address: "" });
    }
  };

  const editClient = (index) => {
    setEditingIndex(index);
    setNewClient(clients[index]);
  };

  const removeClient = (index) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.cpfCnpj.includes(search)
  );

  return (
    <Container>
      <h1>Cadastro de Clientes</h1>
      <SearchBar
        type="text"
        placeholder="Pesquisar por nome ou CPF/CNPJ"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <AddForm>
        <Input
          type="text"
          name="name"
          placeholder="Nome do Cliente"
          value={newClient.name}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="cpfCnpj"
          placeholder="CPF/CNPJ"
          value={newClient.cpfCnpj}
          onChange={handleInputChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={newClient.email}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="phone"
          placeholder="Telefone"
          value={newClient.phone}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="address"
          placeholder="Endereço"
          value={newClient.address}
          onChange={handleInputChange}
        />
        <Button onClick={addOrUpdateClient}>
          {editingIndex !== null ? "Atualizar" : "Adicionar"}
        </Button>
      </AddForm>
      <Table>
        <thead>
          <TableRow>
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
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.cpfCnpj}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell>
                <Button onClick={() => editClient(index)}>Editar</Button>
                <Button onClick={() => removeClient(index)}>Remover</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Clientes;
