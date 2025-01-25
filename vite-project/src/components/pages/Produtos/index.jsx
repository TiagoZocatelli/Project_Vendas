import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Container,
  Input,
  SearchBar,
  Label,
  Select,
  Button,
  Notification,
  ConfirmModalContainer,
  ConfirmCancelButton,
  ConfirmButton,
  ConfirmModalContent,
  ConfirmButtonContainer
} from '../../../styles/utils'
import {
  AddProductForm,
  ImageContainer,
  RemoveImageButton,
  ModalContainer,
  ModalContent,
  CloseButton,
  ModalButton,
  ButtonContainer,
  SearchContainer,
  ActionIcon,
  DivCategory,
  InputContainer,
  FormLayout,
  ImagePreview,
  FormGroup
} from "./styles"; // Importe o estilo Notification
import api from "../../../api";
import { FaCheckCircle, FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [filiais, setFiliais] = useState([]);
  const [selectedFilial, setSelectedFilial] = useState("");
  const [message, setMessage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // Categoria sendo editada
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [newProduct, setNewProduct] = useState({
    nome: "",
    codigo_barras: "",
    preco_custo: "",
    preco_venda: "",
    margem: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/fechar o modal

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsConfirmDeleteOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/png", "image/jpeg", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (!validFormats.includes(file.type)) {
        showMessage("Formato de imagem inválido. Apenas PNG e JPG são permitidos.", "error");
        return;
      }
      if (file.size > maxSize) {
        showMessage("A imagem deve ter no máximo 2MB.", "error");
        return;
      }
      setSelectedImage(file);
    }
  };

  const validateProduct = () => {
    const errors = {};

    // Validação do nome
    if (!newProduct.nome.trim()) {
      errors.nome = "O nome do produto é obrigatório.";
    }

    // Validação do código de barras
    if (!newProduct.codigo_barras || !/^\d+$/.test(newProduct.codigo_barras)) {
      errors.codigo_barras = "O código de barras deve conter apenas números.";
    }

    // Validação do preço de custo
    if (!newProduct.preco_custo || isNaN(newProduct.preco_custo) || parseFloat(newProduct.preco_custo) <= 0) {
      errors.preco_custo = "O preço de custo deve ser um número válido maior que zero.";
    }

    // Validação do preço de venda
    if (!newProduct.preco_venda || isNaN(newProduct.preco_venda) || parseFloat(newProduct.preco_venda) <= 0) {
      errors.preco_venda = "O preço de venda deve ser um número válido maior que zero.";
    } else if (parseFloat(newProduct.preco_venda) <= parseFloat(newProduct.preco_custo)) {
      errors.preco_venda = "O preço de venda deve ser maior que o preço de custo.";
    }

    return errors;
  };


  const startEdit = (category) => {
    setEditingCategory({ ...category }); // Configura a categoria para edição
  };

  const cancelEdit = () => {
    setEditingCategory(null); // Cancela a edição
  };

  const saveCategory = async (id) => {
    try {
      await api.put(`/categorias/${id}`, { nome: editingCategory.nome });
      showMessage("Categoria atualizada com sucesso.");
      fetchCategories(); // Atualiza a lista de categorias
      setEditingCategory(null); // Sai do modo de edição
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      showMessage("Erro ao atualizar categoria.", "error");
    }
  };

  const removeCategory = async (id) => {
    try {
      await api.delete(`/categorias/${id}`);
      showMessage("Categoria removida com sucesso.");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
      showMessage("Erro ao remover categoria.", "error");
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await api.get("/categorias");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      showMessage("Erro ao buscar categorias.", "error");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      showMessage("O nome da categoria não pode estar vazio.", "error");
      setIsModalOpen(false)
      return;
    }

    try {
      await api.post("/categorias", { nome: newCategory });
      showMessage("Categoria adicionada com sucesso.");
      setNewCategory("");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      showMessage("Erro ao adicionar categoria.", "error");
    }
  };


  // Fecha o modal quando uma mensagem de sucesso é exibid


  const uploadProductImage = async (productId) => {
    if (!selectedImage) {
      console.log("Nenhuma imagem selecionada.");
      return;
    }

    const formData = new FormData();
    formData.append("imagem", selectedImage);

    try {
      console.log("Enviando imagem:", selectedImage.name);
      console.log("ID do produto:", productId);

      const response = await api.put(`/produtos/${productId}/imagem`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Resposta da API (Upload Imagem):", response.data);
      showMessage("Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error.response || error.message);
      showMessage("Erro ao enviar imagem.", "error");
    }
  };





  const removeImage = async (productId) => {
    try {
      await api.delete(`/produtos/${productId}/imagem`);
      showMessage("Imagem removida com sucesso!");
      fetchProducts(); // Atualiza os produtos para refletir a remoção
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      showMessage("Erro ao remover imagem.", "error");
    }
  };

  useEffect(() => {
    fetchFiliais();
  }, []);

  useEffect(() => {
    if (filiais.length > 0 && !selectedFilial) {
      setSelectedFilial(filiais[0].id.toString());
    }
  }, [filiais]);

  useEffect(() => {
    if (selectedFilial) {
      fetchProducts();
      fetchCategories()
    }
  }, [selectedFilial]);



  const fetchProducts = async () => {
    try {
      const response = await api.get("/produtos");
      const fetchedProducts = response.data.map((product) => ({
        ...product,
        preco_custo: parseFloat(product.preco_custo),
        preco_venda: parseFloat(product.preco_venda),
        margem: parseFloat(product.margem).toFixed(2),
        estoque: selectedFilial
          ? product.estoques.find((e) => e.filial_id === parseInt(selectedFilial, 10))?.quantidade || "N/A"
          : "Selecione uma filial",
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchFiliais = async () => {
    try {
      const response = await api.get("/filiais");
      setFiliais(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar filiais:", error);
    }
  };

  const handleFilialChange = (filialId) => {
    setSelectedFilial(filialId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo atualizado: ${name}, Valor: ${value}`); // Debug
    setNewProduct({ ...newProduct, [name]: value });
  };


  const addOrUpdateProduct = async () => {
    console.log("Dados do produto antes de salvar:", newProduct);
  
    const validationErrors = validateProduct();
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => showMessage(error, "error"));
      return;
    }
  
    try {
      let productId = null;
      if (editingIndex !== null) {
        productId = products[editingIndex].id;
        console.log("Atualizando produto com ID:", productId);
        await api.put(`/produtos/${productId}`, {
          ...newProduct,
          margem: calculateMargin(),
        });
        showMessage("Produto atualizado com sucesso!");
      } else {
        console.log("Cadastrando novo produto...");
        const response = await api.post("/produtos", {
          ...newProduct,
          margem: calculateMargin(),
        });
        productId = response.data.id;
        console.log("Produto criado com ID:", productId);
        showMessage("Produto adicionado com sucesso!");
      }
  
      if (selectedImage) {
        console.log("Fazendo upload da imagem...");
        await uploadProductImage(productId);
      }
  
      fetchProducts();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error.response || error.message);
      showMessage("Erro ao salvar produto.", "error");
    }
  };
  

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/produtos/${productToDelete.id}`);
      fetchProducts(); // Atualiza a lista de produtos
      showMessage("Produto removido com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      showMessage("Erro ao remover produto", "error");
    } finally {
      setIsConfirmDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const editProduct = (index) => {
    // Localiza o produto na lista filtrada e busca o ID
    const filteredProduct = currentProducts[index]; // Produto da página atual
    const productIndex = products.findIndex((product) => product.id === filteredProduct.id); // Busca o índice na lista completa

    setEditingIndex(productIndex); // Salva o índice completo
    setNewProduct({
      ...filteredProduct,
      imagem: filteredProduct.imagem || null, // Carrega a imagem, se existir
    });
    setSelectedImage(null); // Reseta a seleção de imagem
    setIsModalOpen(true); // Abre o modal
  };



  const resetForm = () => {
    setNewProduct({
      nome: "",
      codigo_barras: "",
      preco_custo: "",
      preco_venda: "",
      margem: "",
      categoria_id: "",
    });
    setEditingIndex(null);
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    if (message && message.type === "error") {
      setIsModalOpen(false);
      setIsCategoryModalOpen(false);
      resetForm() // Fecha o modal ao exibir uma mensagem de sucesso
    }
  }, [message]);




  const calculateMargin = () => {
    if (newProduct.preco_custo && newProduct.preco_venda) {
      const margem = ((parseFloat(newProduct.preco_venda) - parseFloat(newProduct.preco_custo)) / parseFloat(newProduct.preco_custo)) * 100;
      return margem.toFixed(2);
    }
    return "";
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nome.toLowerCase().includes(search.toLowerCase()) ||
      product.codigo_barras.includes(search)
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const limpaCampos = () => {
    setIsModalOpen(false)
    resetForm()
  }

  return (
    <Container>
      <h1>Cadastro de Produtos</h1>
      {message && (
        <Notification type={message.type}>
          {message.type === "success" ? (
            <FaCheckCircle size={20} />
          ) : (
            <FaExclamationCircle size={20} />
          )}
          {message.text}
        </Notification>
      )}

      {isConfirmDeleteOpen && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza de que deseja excluir o produto <br /> "{productToDelete?.nome}" ?</p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={handleDeleteConfirmed}>Sim, Excluir</ConfirmButton>
              <ConfirmCancelButton onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}


      <SearchContainer>
        <Label htmlFor="filialSelect">Filial:</Label>
        <Select
          id="filialSelect"
          onChange={(e) => handleFilialChange(e.target.value)}
          value={selectedFilial}
        >
          {filiais.map((filial) => (
            <option key={filial.id} value={filial.id}>
              {filial.nome}
            </option>
          ))}
        </Select>
        <SearchBar
          type="text"
          placeholder="Pesquisar por nome ou código de barras"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setIsModalOpen(true)}>Adicionar Produto</Button>
        <Button onClick={() => setIsCategoryModalOpen(true)}>Gerenciar Categorias</Button>
      </SearchContainer>
      {/* Modal de Categorias */}
      {isCategoryModalOpen && (
        <ModalContainer>
          <ModalContent>
            <CloseButton onClick={() => setIsCategoryModalOpen(false)}>
              &#10005;
            </CloseButton>
            <h2>Gerenciar Categorias</h2>

            <DivCategory>
              {/* Input para adicionar nova categoria */}
              <Input
                type="text"
                placeholder="Nova Categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button onClick={addCategory}>Adicionar Categoria</Button>
            </DivCategory>

            {/* Tabela de Categorias */}
            <h3>Categorias Existentes:</h3>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>
                      {editingCategory?.id === category.id ? (
                        <Input
                          type="text"
                          value={editingCategory.nome}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              nome: e.target.value,
                            })
                          }
                        />
                      ) : (
                        category.nome
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCategory?.id === category.id ? (
                        <>
                          <ActionIcon onClick={() => saveCategory(category.id)}>
                            <FaCheckCircle size={16} style={{ color: "green" }} />
                          </ActionIcon>
                          <ActionIcon onClick={() => cancelEdit()}>
                            <FaExclamationCircle size={16} style={{ color: "orange" }} />
                          </ActionIcon>
                        </>
                      ) : (
                        <>
                          <ActionIcon onClick={() => startEdit(category)}>
                            <FaEdit size={16} style={{ color: "#FF9800" }} />
                          </ActionIcon>
                          <ActionIcon onClick={() => removeCategory(category.id)}>
                            <FaTrash size={16} style={{ color: "#f43f5e" }} />
                          </ActionIcon>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </ModalContent>
        </ModalContainer>
      )}


      {isModalOpen && (
        <ModalContainer>
          <ModalContent>
            <CloseButton onClick={() => limpaCampos()}>&#10005;</CloseButton>
            <h2>{editingIndex !== null ? "Editar Produto" : "Adicionar Novo Produto"}</h2>
            <AddProductForm>
              {/* Contêiner para organizar os inputs e a imagem */}
              <FormLayout>
                {/* Inputs */}
                <InputContainer>
                  <FormGroup>
                    <label>Nome:</label>
                    <input
                      type="text"
                      name="nome"
                      placeholder="Nome do Produto"
                      value={newProduct.nome}
                      onChange={handleInputChange}
                    />
                    {errors.nome && <span style={{ color: "red" }}>{errors.nome}</span>}
                  </FormGroup>
                  <FormGroup>
                    <label>Código de Barras:</label>
                    <input
                      type="number"
                      name="codigo_barras"
                      placeholder="Código de Barras"
                      value={newProduct.codigo_barras}
                      onChange={handleInputChange}
                    />
                    {errors.codigo_barras && (
                      <span style={{ color: "red" }}>{errors.codigo_barras}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <label>Preço de Custo:</label>
                    <input
                      type="number"
                      name="preco_custo"
                      placeholder="Preço de Custo"
                      value={newProduct.preco_custo}
                      onChange={handleInputChange}
                    />
                    {errors.preco_custo && (
                      <span style={{ color: "red" }}>{errors.preco_custo}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <label>Preço de Venda:</label>
                    <input
                      type="number"
                      name="preco_venda"
                      placeholder="Preço de Venda"
                      value={newProduct.preco_venda}
                      onChange={handleInputChange}
                    />
                    {errors.preco_venda && (
                      <span style={{ color: "red" }}>{errors.preco_venda}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <label>Categoria:</label>
                    <Select
                      id="categoria"
                      name="categoria_id"
                      value={newProduct.categoria_id || ""}
                      onChange={(e) => handleInputChange(e)}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nome}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                </InputContainer>

                {/* Imagem */}
                <ImageContainer>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {selectedImage && <span>{selectedImage.name}</span>}
                  {newProduct.imagem && !selectedImage && (
                    <ImagePreview
                      src={`data:image/png;base64,${newProduct.imagem}`}
                      alt="Imagem do Produto"
                    />
                  )}
                </ImageContainer>
              </FormLayout>
              {/* Botões */}
              <ButtonContainer>
                <ModalButton
                  onClick={(event) => {
                    event.preventDefault();
                    addOrUpdateProduct(newProduct.id);
                  }}
                >
                  {editingIndex !== null ? "Atualizar Produto" : "Adicionar Produto"}
                </ModalButton>
                <RemoveImageButton onClick={() => removeImage(newProduct.id)}>
                  Remover Imagem
                </RemoveImageButton>
              </ButtonContainer>
            </AddProductForm>
          </ModalContent>
        </ModalContainer>
      )}



      {/* Tabela de Produtos */}
      <Table>
        <thead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Imagem</TableHeader>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Categoria</TableHeader>
            <TableHeader>Código de Barras</TableHeader>
            <TableHeader>Custo</TableHeader>
            <TableHeader>Preço</TableHeader>
            <TableHeader>Margem (%)</TableHeader>
            <TableHeader>Estoque</TableHeader>
            <TableHeader>Ações</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>
                {product.imagem ? (
                  <img
                    src={`data:image/png;base64,${product.imagem}`}
                    alt="Produto"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                ) : (
                  <span>Sem imagem</span>
                )}
              </TableCell>
              <TableCell>{product.nome}</TableCell>
              <TableCell>
                {product.categoria_nome}
              </TableCell>
              <TableCell>{product.codigo_barras}</TableCell>
              <TableCell>R$ {product.preco_custo.toFixed(2)}</TableCell>
              <TableCell>R$ {product.preco_venda.toFixed(2)}</TableCell>
              <TableCell>{product.margem}%</TableCell>
              <TableCell>{product.estoque | "0"}</TableCell>
              <TableCell>
                <ActionIcon onClick={() => editProduct(index)}>
                  <FaEdit size={16} style={{ color: "#FF9800" }} />
                </ActionIcon>
                <ActionIcon onClick={() => confirmDeleteProduct(product)}>
                  <FaTrash size={16} style={{ color: "#f43f5e" }} />
                </ActionIcon>
              </TableCell>
            </TableRow>
          ))}
        </tbody>


      </Table>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Button onClick={prevPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <span style={{ margin: "0 10px", alignSelf: "center" }}>
          Página {currentPage} de {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Próxima
        </Button>
      </div>
    </Container>
  );
};

export default Produtos;
