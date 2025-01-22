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
} from "./styles"; // Adicione o estilo Notification
import api from "../../../api";

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null); // Estado para mensagens
  const [newProduct, setNewProduct] = useState({
    nome: "",
    codigo_barras: "",
    preco_custo: "",
    preco_venda: "",
    margem: "",
    estoque: "",
  });
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/produtos");
      const fetchedProducts = response.data.map((product) => ({
        ...product,
        preco_custo: parseFloat(product.preco_custo),
        preco_venda: parseFloat(product.preco_venda),
        margem: parseFloat(product.margem).toFixed(2),
        estoque: parseInt(product.estoque, 10),
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000); // Oculta a mensagem após 3 segundos
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addOrUpdateProduct = async () => {
    try {
      if (editingIndex !== null) {
        await api.put(`/produtos/${products[editingIndex].id}`, {
          ...newProduct,
          margem: calculateMargin(),
        });
        showMessage("Produto atualizado com sucesso!");
      } else {
        await api.post("/produtos", {
          ...newProduct,
          margem: calculateMargin(),
        });
        showMessage("Produto adicionado com sucesso!");
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      showMessage("Erro ao salvar produto", "error");
    }
  };

  const resetForm = () => {
    setNewProduct({
      nome: "",
      codigo_barras: "",
      preco_custo: "",
      preco_venda: "",
      margem: "",
      estoque: "",
    });
    setEditingIndex(null);
  };

  const editProduct = (index) => {
    setEditingIndex(index);
    setNewProduct(products[index]);
  };

  const removeProduct = async (index) => {
    try {
      await api.delete(`/produtos/${products[index].id}`);
      fetchProducts();
      showMessage("Produto deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      showMessage("Erro ao remover produto", "error");
    }
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
      (product.nome && product.nome.toLowerCase().includes(search.toLowerCase())) ||
      (product.codigo_barras && product.codigo_barras.includes(search))
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  return (
    <Container>
      <h1>Cadastro de Produtos</h1>
      {message && (
        <Notification type={message.type}>
          {message.text}
        </Notification>
      )}
      <SearchBar
        type="text"
        placeholder="Pesquisar por nome ou código de barras"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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
        <Input
          type="text"
          name="margem"
          placeholder="Margem (%)"
          value={calculateMargin()}
          disabled
        />
        <Input
          type="number"
          name="estoque"
          placeholder="Estoque"
          value={newProduct.estoque}
          onChange={handleInputChange}
        />
        <Button onClick={addOrUpdateProduct}>
          {editingIndex !== null ? "Atualizar" : "Adicionar"}
        </Button>
      </AddProductForm>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Código de Barras</TableHeader>
            <TableHeader>Custo</TableHeader>
            <TableHeader>Preço</TableHeader>
            <TableHeader>Margem (%)</TableHeader>
            <TableHeader>Estoque</TableHeader>
            <TableHeader>Ativo</TableHeader>
            <TableHeader>Criado em</TableHeader>
            <TableHeader>Atualizado em</TableHeader>
            <TableHeader>Ações</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.nome || "N/A"}</TableCell>
              <TableCell>{product.codigo_barras || "N/A"}</TableCell>
              <TableCell>R$ {product.preco_custo ? product.preco_custo.toFixed(2) : "N/A"}</TableCell>
              <TableCell>R$ {product.preco_venda ? product.preco_venda.toFixed(2) : "N/A"}</TableCell>
              <TableCell>{product.margem || "N/A"}%</TableCell>
              <TableCell>{product.estoque || "N/A"}</TableCell>
              <TableCell>{product.ativo ? "Sim" : "Não"}</TableCell>
              <TableCell>{formatDate(product.criado_em) || "N/A"}</TableCell>
              <TableCell>{formatDate(product.atualizado_em) || "N/A"}</TableCell>
              <TableCell>
                <Button onClick={() => editProduct(index)}>Editar</Button>
                <Button onClick={() => removeProduct(index)}>Remover</Button>
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
