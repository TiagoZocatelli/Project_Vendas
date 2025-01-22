import { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  AddProductForm,
  Input,
  Button,
  SearchBar,
  Notification,
  ImageContainer,
  ImagePreview,
  RemoveImageButton,
  ModalContainer,
  ModalContent,
  CloseButton
} from "./styles"; // Importe o estilo Notification
import api from "../../../api";

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [selectedFilial, setSelectedFilial] = useState("");
  const [message, setMessage] = useState(null);
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


  const uploadProductImage = async (productId) => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("imagem", selectedImage);
      try {
        await api.put(`/produtos/${productId}/imagem`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("Imagem atualizada com sucesso!");
        fetchProducts(); // Atualiza os produtos para refletir a imagem
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        showMessage("Erro ao enviar imagem.", "error");
      }
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
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addOrUpdateProduct = async () => {
    try {
      if (editingIndex !== null) {
        // Atualiza o produto
        await api.put(`/produtos/${products[editingIndex].id}`, {
          ...newProduct,
          margem: calculateMargin(),
        });
        showMessage("Produto atualizado com sucesso!");

        if (selectedImage) {
          await uploadProductImage(products[editingIndex].id);
        }
      } else {
        // Cria novo produto
        const response = await api.post("/produtos", {
          ...newProduct,
          margem: calculateMargin(),
        });
        showMessage("Produto adicionado com sucesso!");

        if (selectedImage) {
          await uploadProductImage(response.data.id);
        }
      }
      fetchProducts();
      resetForm();
      setIsModalOpen(false); // Fecha o modal após a operação
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      showMessage("Erro ao salvar produto", "error");
    }
  };

  const removeProduct = async (id) => {
    try {
      await api.delete(`/produtos/${id}`);
      fetchProducts();
      showMessage("Produto removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      showMessage("Erro ao remover produto", "error");
    }
  };

  const editProduct = (index) => {
    // Pegando o produto correto da lista filtrada com base no índice da página atual
    const filteredProduct = filteredProducts[index]; // Pega o produto da lista filtrada com base no índice
    const productIndex = products.findIndex((product) => product.id === filteredProduct.id); // Encontra o índice correto no array original

    setEditingIndex(productIndex); // Define o índice correto no estado
    setNewProduct(filteredProduct); // Define os dados do produto para edição
    setSelectedImage(null); // Limpa a imagem selecionada
    setIsModalOpen(true); // Abre o modal para edição
  };

  const resetForm = () => {
    setNewProduct({
      nome: "",
      codigo_barras: "",
      preco_custo: "",
      preco_venda: "",
      margem: "",
    });
    setEditingIndex(null);
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

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

  return (
    <Container>
      <h1>Cadastro de Produtos</h1>
      {message && <Notification type={message.type}>{message.text}</Notification>}
      <SearchBar
        type="text"
        placeholder="Pesquisar por nome ou código de barras"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="filialSelect">Filial: </label>
        <select id="filialSelect" onChange={(e) => handleFilialChange(e.target.value)} value={selectedFilial}>
          {filiais.map((filial) => (
            <option key={filial.id} value={filial.id}>
              {filial.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Botão para abrir o modal */}
      <Button onClick={() => setIsModalOpen(true)}>Adicionar Produto</Button>

      {/* Modal de Cadastro de Produto */}
      {isModalOpen && (
        <ModalContainer>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>&#10005;</CloseButton>
            <AddProductForm>
              <Input
                type="text"
                name="nome"
                placeholder="Nome do Produto"
                value={newProduct.nome}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="codigo_barras"
                placeholder="Código de Barras"
                value={newProduct.codigo_barras}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                name="preco_custo"
                placeholder="Custo"
                value={newProduct.preco_custo}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                name="preco_venda"
                placeholder="Preço de Venda"
                value={newProduct.preco_venda}
                onChange={handleInputChange}
              />
              <ImageContainer>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage && <span>{selectedImage.name}</span>}
                {newProduct.imagem && !selectedImage && (
                  <div>
                    <img
                      src={`data:image/png;base64,${product.imagem}`}
                      alt="Imagem do Produto"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />

                    <RemoveImageButton onClick={() => removeImage(newProduct.id)}>
                      Remover Imagem
                    </RemoveImageButton>
                  </div>
                )}
              </ImageContainer>
              <Button onClick={addOrUpdateProduct}>
                {editingIndex !== null ? "Atualizar Produto" : "Adicionar Produto"}
              </Button>
            </AddProductForm>
          </ModalContent>
        </ModalContainer>
      )}

      {/* Tabela de Produtos */}
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Imagem</TableHeader>
            <TableHeader>Nome</TableHeader>
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
              <TableCell>{product.codigo_barras}</TableCell>
              <TableCell>R$ {product.preco_custo.toFixed(2)}</TableCell>
              <TableCell>R$ {product.preco_venda.toFixed(2)}</TableCell>
              <TableCell>{product.margem}%</TableCell>
              <TableCell>{product.estoque}</TableCell>
              <TableCell>
                <Button onClick={() => editProduct(index)}>Editar</Button>
                <Button onClick={() => removeProduct(product.id)}>Remover</Button>
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
