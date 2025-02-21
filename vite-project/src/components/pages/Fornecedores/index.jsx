import { useState, useEffect } from "react";
import axios from "axios";
import {
  FormGroup,
  ModalOverlay,
  ModalActions,
  ModalContent,
  FormContainer,
  DivHeader,
} from "./styles"; // Certifique-se de que o estilo `Notification` está definido aqui

import {
  Notification,
  Container,
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
  Select,
  Input,
} from "../../../styles/utils";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../../api";
import InputMask from "react-input-mask";

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
  const [documentType, setDocumentType] = useState(""); // CPF ou CNPJ


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
      const response = await api.get("/fornecedores");
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

  const formatCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf; // Verifica se o CPF é válido
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (phone) => {
    if (!phone) return phone;
    
    // Remover caracteres não numéricos
    phone = phone.replace(/\D/g, "");
  
    // Formato para telefone fixo (ex: (44) 3222-1234)
    if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
  
    // Formato para celular (ex: (44) 99897-1234)
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  
    return phone; // Retorna o número sem formatação se não corresponder
  };

  const formatCEP = (cep) => {
    if (!cep || cep.length !== 8) return cep; // Verifica se o CEP é válido
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  };
  
  

  const removeMask = (value) => value.replace(/\D/g, ""); // Remove tudo que não for número

  const addOrUpdateSupplier = async () => {
    console.log("📌 Dados do formulário antes da validação:", newSupplier);

    // Verifica se todos os campos obrigatórios estão preenchidos corretamente
    const requiredFields = [
      "name",
      "cnpj",
      "email",
      "phone",
      "address",
      "estado",
      "cidade",
      "cep",
    ];

    const isEmpty = requiredFields.some((field) => {
      console.log(`🔍 Verificando campo "${field}":`, newSupplier[field]);
      return !newSupplier[field] || newSupplier[field].trim() === "";
    });

    if (isEmpty) {
      showMessage("error", "Todos os campos obrigatórios devem ser preenchidos.");
      console.error("🚨 ERRO: Algum campo obrigatório está vazio!", newSupplier);
      return;
    }

    try {
      const payload = {
        nome: newSupplier.name,
        cnpj: removeMask(newSupplier.cnpj),  // 🔹 Remove pontuação do CNPJ
        telefone: removeMask(newSupplier.phone),  // 🔹 Remove pontuação do telefone
        endereco: newSupplier.address,
        email: newSupplier.email,
        estado: newSupplier.estado,
        cidade: newSupplier.cidade,
        cep: removeMask(newSupplier.cep),  // 🔹 Remove pontuação do CEP
      };

      console.log("📌 Payload enviado para API:", payload);

      if (editingIndex !== null) {
        const supplierToUpdate = suppliers[editingIndex];
        await api.put(`/fornecedores/${supplierToUpdate.id}`, payload);
        showMessage("success", "Fornecedor atualizado com sucesso!");
      } else {
        await api.post("/fornecedores", payload);
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
      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Erro ao salvar fornecedor.";
      showMessage("error", errorMessage);
      console.error("🚨 Erro na API:", error);
    }
  };


  const editSupplier = (index) => {
    openModal(index);
    setNewSupplier(suppliers[index]);
  };

  const removeSupplier = async (id) => {
    try {
      await api.delete(`/fornecedores/${id}`);
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
            <p>
              Tem certeza de que deseja excluir o fornecedor "
              {productToDelete?.name}"?
            </p>
            <ConfirmButtonContainer>
              <ConfirmButton
                onClick={() => removeSupplier(productToDelete?.id)}
              >
                Sim, Excluir
              </ConfirmButton>
              <ConfirmCancelButton
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                Cancelar
              </ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}
      <h1>Cadastro de Fornecedores</h1>
      <DivHeader>
        <Button onClick={() => openModal()}>Adicionar Fornecedor</Button>
        {notification.text && (
          <Notification type={notification.type}>
            {notification.text}
          </Notification>
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
            <h2>
              {editingIndex !== null
                ? "Editar Fornecedor"
                : "Adicionar Fornecedor"}
            </h2>
            <form>
              <FormContainer>
                <FormGroup>
                  <label>Nome:</label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    value={newSupplier.name || ""}  // ✅ Garante que o campo nunca será undefined
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, name: e.target.value })
                    }
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Selecione o tipo de documento:</label>
                  <Select
                    value={documentType}
                    onChange={(e) => {
                      setDocumentType(e.target.value);
                      setNewSupplier({ cnpj: "" }); // Reseta o campo ao mudar de tipo
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                  </Select>
                </FormGroup>

                {documentType && (
                  <FormGroup>
                    <label>{documentType === "cpf" ? "CPF" : "CNPJ"}:</label>
                    <InputMask
                      mask={documentType === "cpf" ? "999.999.999-99" : "99.999.999/9999-99"}
                      value={newSupplier.cnpj}
                      onChange={(e) => setNewSupplier({ cnpj: e.target.value })}
                    >
                      {(inputProps) => (
                        <Input {...inputProps} type="text" placeholder={`Digite o ${documentType.toUpperCase()}`} required />
                      )}
                    </InputMask>
                  </FormGroup>
                )}


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
                  <InputMask
                    mask="(99) 99999-9999"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  >
                    {(inputProps) => <input {...inputProps} type="text" placeholder="Digite o telefone" required />}
                  </InputMask>
                </FormGroup>
                <FormGroup>
                  <label>Endereço:</label>
                  <input
                    type="text"
                    placeholder="Digite o endereço"
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        address: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>Estado:</label>
                  <Select
                    value={newSupplier.estado}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, estado: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </Select>
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
                  <InputMask
                    mask="99999-999"
                    value={newSupplier.cep}
                    onChange={(e) => setNewSupplier({ ...newSupplier, cep: e.target.value })}
                  >
                    {(inputProps) => <input {...inputProps} type="text" placeholder="Digite o CEP" required />}
                  </InputMask>
                </FormGroup>
              </FormContainer>
            </form>
            <ModalActions>
              <ConfirmButton onClick={addOrUpdateSupplier}>
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
              <TableCell>{formatCPF(supplier.cnpj)}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{formatPhone(supplier.phone)}</TableCell>
              <TableCell>{supplier.address}</TableCell>
              <TableCell>{supplier.estado}</TableCell>
              <TableCell>{supplier.cidade}</TableCell>
              <TableCell>{formatCEP(supplier.cep)}</TableCell>

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
