import { useState, useEffect } from "react";
import axios from "axios";
import {
  AddForm,
  FormGroup,
  Input,
  ModalOverlay,
  ModalActions,
  ModalContent,
  FormContainer,
  DivHeader,
} from "./styles"; // Certifique-se de que o estilo `Notification` está definido aqui

import {
  Label, Notification, Container,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Button,
  SearchBar,
  ActionIcon,
  ConfirmModalContainer,
  ConfirmModalContent,
  ConfirmButton,
  ConfirmCancelButton,
  ConfirmButtonContainer,
} from "../../../styles/utils";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ type: "", text: "" });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const showMessage = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: "", text: "" }), 3000); // Remove a notificação após 3 segundos
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsConfirmDeleteOpen(true);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/fornecedores");
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

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setNewSupplier(suppliers[index]);
    } else {
      setEditingIndex(null);
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
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            `http://127.0.0.1:5000/fornecedores/${supplierToUpdate.id}`,
            payload
          );
          showMessage("success", "Fornecedor atualizado com sucesso!");
          closeModal()
        } else {
          await axios.post("http://127.0.0.1:5000/fornecedores", payload);
          showMessage("success", "Fornecedor cadastrado com sucesso!");
          closeModal()
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
      closeModal()
    }
  };

  const editSupplier = (index) => {
    openModal(index);
    setNewSupplier(suppliers[index]);
  };

  const removeSupplier = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/fornecedores/${id}`);
      showMessage("success", "Fornecedor removido com sucesso!");
      fetchSuppliers();
      setIsConfirmDeleteOpen(false); // Fecha o modal de confirmação
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

      {isConfirmDeleteOpen && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza de que deseja excluir o fornecedor "{productToDelete?.name}"?</p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={() => removeSupplier(productToDelete?.id)}>Sim, Excluir</ConfirmButton>
              <ConfirmCancelButton onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}
      <h1>Cadastro de Fornecedores</h1>
      <DivHeader>
        <Button onClick={() => openModal()}>Adicionar Fornecedor</Button>
        {notification.text && (
          <Notification type={notification.type}>{notification.text}</Notification>
        )}
        <SearchBar
          type="text"
          placeholder="Pesquisar por nome ou CNPJ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </DivHeader>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2>{editingIndex !== null ? "Editar Fornecedor" : "Adicionar Fornecedor"}</h2>
            <form>
              <FormContainer>
                <FormGroup>
                  <label>Nome:</label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    value={newSupplier.name}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, name: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>CNPJ:</label>
                  <input
                    type="text"
                    placeholder="Digite o CNPJ"
                    value={newSupplier.cnpj}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, cnpj: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>Email:</label>
                  <input
                    type="email"
                    placeholder="Digite o email"
                    value={newSupplier.email}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, email: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>Telefone:</label>
                  <input
                    type="text"
                    placeholder="Digite o telefone"
                    value={newSupplier.phone}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, phone: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>Endereço:</label>
                  <input
                    type="text"
                    placeholder="Digite o endereço"
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, address: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>Estado:</label>
                  <input
                    type="text"
                    placeholder="Digite o estado"
                    value={newSupplier.estado}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, estado: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>Cidade:</label>
                  <input
                    type="text"
                    placeholder="Digite a cidade"
                    value={newSupplier.cidade}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, cidade: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>CEP:</label>
                  <input
                    type="text"
                    placeholder="Digite o CEP"
                    value={newSupplier.cep}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, cep: e.target.value })
                    }
                  />
                </FormGroup>
              </FormContainer>
            </form>
            <ModalActions>
              <Button onClick={addOrUpdateSupplier}>
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
                <ActionIcon onClick={() => editSupplier(index)}>
                  <FaEdit size={16} style={{ color: "#FF9800" }} />
                </ActionIcon>
                <ActionIcon onClick={() => confirmDeleteProduct(supplier)}>
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

export default Fornecedores;
