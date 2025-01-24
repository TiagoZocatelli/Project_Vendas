import { useState, useEffect } from "react";
import axios from "axios";
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
} from "./styles"; // Certifique-se de que o estilo `Notification` está definido aqui
import { Label, Notification } from "../Produtos/styles";

const Fornecedores = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    estado: "",
    cidade: "",
    cep: "",
  });
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [notification, setNotification] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: "", text: "" }), 3000); // Remove a notificação após 3 segundos
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://192.168.1.56:5000/fornecedores");
      const formattedSuppliers = response.data.map((supplier) => ({
        name: supplier.nome,
        cnpj: supplier.cnpj,
        email: supplier.email || "",
        phone: supplier.telefone || "",
        address: supplier.endereco || "",
        estado: supplier.estado || "",
        cidade: supplier.cidade || "",
        cep: supplier.cep || "",
        id: supplier.id,
      }));
      setSuppliers(formattedSuppliers);
    } catch (error) {
      showMessage("error", "Erro ao buscar fornecedores.");
      console.error("Erro ao buscar fornecedores:", error);
    }
  };

  const addOrUpdateSupplier = async () => {
    if (
      newSupplier.name &&
      newSupplier.cnpj &&
      newSupplier.email &&
      newSupplier.phone &&
      newSupplier.address &&
      newSupplier.estado &&
      newSupplier.cidade &&
      newSupplier.cep
    ) {
      try {
        const payload = {
          nome: newSupplier.name,
          cnpj: newSupplier.cnpj,
          telefone: newSupplier.phone,
          endereco: newSupplier.address,
          email: newSupplier.email,
          estado: newSupplier.estado,
          cidade: newSupplier.cidade,
          cep: newSupplier.cep,
        };

        if (editingIndex !== null) {
          const supplierToUpdate = suppliers[editingIndex];
          await axios.put(
            `http://192.168.1.56:5000/fornecedores/${supplierToUpdate.id}`,
            payload
          );
          showMessage("success", "Fornecedor atualizado com sucesso!");
        } else {
          await axios.post("http://192.168.1.56:5000/fornecedores", payload);
          showMessage("success", "Fornecedor cadastrado com sucesso!");
        }

        fetchSuppliers();
        setNewSupplier({
          name: "",
          cnpj: "",
          email: "",
          phone: "",
          address: "",
          estado: "",
          cidade: "",
          cep: "",
        });
        setEditingIndex(null);
      } catch (error) {
        showMessage("error", "Erro ao salvar fornecedor.");
        console.error("Erro ao salvar fornecedor:", error);
      }
    } else {
      showMessage("error", "Todos os campos obrigatórios devem ser preenchidos.");
    }
  };

  const editSupplier = (index) => {
    setEditingIndex(index);
    setNewSupplier(suppliers[index]);
  };

  const removeSupplier = async (index) => {
    try {
      const supplierToRemove = suppliers[index];
      await axios.delete(
        `http://192.168.1.56:5000/fornecedores/${supplierToRemove.id}`
      );
      showMessage("success", "Fornecedor removido com sucesso!");
      fetchSuppliers();
    } catch (error) {
      showMessage("error", "Erro ao remover fornecedor.");
      console.error("Erro ao remover fornecedor:", error);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const supplierName = supplier.name || "";
    const supplierCnpj = supplier.cnpj || "";

    return (
      supplierName.toLowerCase().includes(search.toLowerCase()) ||
      supplierCnpj.includes(search)
    );
  });

  return (
    <Container>
      <h1>Cadastro de Fornecedores</h1>
      {notification.text && (
        <Notification type={notification.type}>{notification.text}</Notification>
      )}
      <Label>Pesquisar: </Label>
      <SearchBar
        type="text"
        placeholder="Pesquisar por nome ou CNPJ"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <AddForm>
        {/* Inputs */}
        <Input
          type="text"
          name="name"
          placeholder="Nome do Fornecedor"
          value={newSupplier.name}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, name: e.target.value })
          }
        />
        <Input
          type="text"
          name="cnpj"
          placeholder="CNPJ"
          value={newSupplier.cnpj}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, cnpj: e.target.value })
          }
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={newSupplier.email}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, email: e.target.value })
          }
        />
        <Input
          type="text"
          name="phone"
          placeholder="Telefone"
          value={newSupplier.phone}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, phone: e.target.value })
          }
        />
        <Input
          type="text"
          name="address"
          placeholder="Endereço"
          value={newSupplier.address}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, address: e.target.value })
          }
        />
        <Input
          type="text"
          name="estado"
          placeholder="Estado (ex: SP)"
          value={newSupplier.estado}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, estado: e.target.value })
          }
        />
        <Input
          type="text"
          name="cidade"
          placeholder="Cidade"
          value={newSupplier.cidade}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, cidade: e.target.value })
          }
        />
        <Input
          type="text"
          name="cep"
          placeholder="CEP"
          value={newSupplier.cep}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, cep: e.target.value })
          }
        />
        <Button onClick={addOrUpdateSupplier}>
          {editingIndex !== null ? "Atualizar" : "Adicionar"}
        </Button>
      </AddForm>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Nome</TableHeader>
            <TableHeader>CNPJ</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Telefone</TableHeader>
            <TableHeader>Endereço</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Cidade</TableHeader>
            <TableHeader>CEP</TableHeader>
            <TableHeader>Ações</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier, index) => (
            <TableRow key={index}>
              <TableCell>{supplier.id}</TableCell>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.cnpj}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.address}</TableCell>
              <TableCell>{supplier.estado}</TableCell>
              <TableCell>{supplier.cidade}</TableCell>
              <TableCell>{supplier.cep}</TableCell>
              <TableCell>
                <Button onClick={() => editSupplier(index)}>Editar</Button>
                <Button onClick={() => removeSupplier(index)}>Remover</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Fornecedores;
