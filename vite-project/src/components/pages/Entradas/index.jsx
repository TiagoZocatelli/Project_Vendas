import { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Button,
  ModalContainer,
  ModalContent,
  AddForm,
  Input,
  SuggestionsList,
  Select,
} from "./styles";

const Entradas = () => {
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [branches, setBranches] = useState([]); // Filiais
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [newEntry, setNewEntry] = useState({
    branchId: "", // Filial selecionada
    supplierId: "",
    supplierName: "",
    supplierCnpj: "",
    total: 0,
    observacoes: "",
    itens: [],
  });

  const [newItem, setNewItem] = useState({
    productId: "",
    productName: "",
    barcode: "",
    quantity: "",
    cost: "",
  });

  const filterSuppliers = (search) => {
    if (!search) {
      setFilteredSuppliers([]); // Remove o filtro
      return;
    }

    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.nome.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const filterProducts = (search) => {
    if (!search) {
      setFilteredProducts([]); // Remove o filtro
      return;
    }

    setFilteredProducts(
      products.filter(
        (product) =>
          product.nome.toLowerCase().includes(search.toLowerCase()) ||
          product.codigo_barras?.includes(search)
      )
    );
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesRes, suppliersRes, productsRes, branchesRes] =
          await Promise.all([
            fetch("http://127.0.0.1:5000/entradas"),
            fetch("http://127.0.0.1:5000/fornecedores"),
            fetch("http://127.0.0.1:5000/produtos"),
            fetch("http://127.0.0.1:5000/filiais"), // Nova rota para filiais
          ]);

        const [entriesData, suppliersData, productsData, branchesData] =
          await Promise.all([
            entriesRes.json(),
            suppliersRes.json(),
            productsRes.json(),
            branchesRes.json(),
          ]);

        setEntries(entriesData);
        setSuppliers(suppliersData);
        setProducts(productsData);
        setBranches(branchesData); // Define as filiais
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const total = newEntry.itens.reduce(
      (acc, item) => acc + item.quantity * item.cost,
      0
    );
    setNewEntry((prev) => ({ ...prev, total: total.toFixed(2) }));
  }, [newEntry.itens]);

  const openModal = (items) => {
    if (!items || items.length === 0) {
      alert("Nenhum item para exibir.");
      return;
    }
    setSelectedItems(items);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItems([]);
    setIsModalOpen(false);
  };

  const openAddModal = () => setIsAddModalOpen(true);

  const setNewProductItem = (product) => {
    setNewItem((prev) => ({
      ...prev,
      productId: product.id,
      productName: product.nome,
      barcode: product.codigo_barras,
      imagem: product.imagem, // Armazena a imagem do produto
    }));
  };


  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewEntry({
      branchId: "",
      supplierId: "",
      supplierName: "",
      supplierCnpj: "",
      total: 0,
      observacoes: "",
      itens: [],
    });
    setFilteredSuppliers([]);
    setFilteredProducts([]);
  };

  const addItemToNewEntry = () => {
    if (!newItem.productId || !newItem.quantity || !newItem.cost) {
      alert("Por favor, preencha todos os campos do item.");
      return;
    }

    const updatedItems = [...newEntry.itens];
    if (editItemIndex !== null) {
      updatedItems[editItemIndex] = { ...newItem };
    } else {
      updatedItems.push({ ...newItem });
    }

    setNewEntry((prev) => ({
      ...prev,
      itens: updatedItems, // Atualiza os itens
      branchId: prev.branchId, // Mantém a filial selecionada
    }));

    setNewItem({
      productId: "",
      productName: "",
      barcode: "",
      quantity: "",
      cost: "",
    });

    setEditItemIndex(null);
  };


  const editItem = (index) => {
    setNewItem(newEntry.itens[index]);
    setEditItemIndex(index);
  };

  const deleteItem = (index) => {
    const updatedItems = newEntry.itens.filter((_, i) => i !== index);
    setNewEntry((prev) => ({ ...prev, itens: updatedItems }));
  };

  const submitNewEntry = async () => {
    if (!newEntry.branchId || !newEntry.supplierId || newEntry.itens.length === 0) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const payload = {
      filial_id: newEntry.branchId,
      fornecedor_id: newEntry.supplierId,
      total: newEntry.total,
      observacoes: newEntry.observacoes,
      itens: newEntry.itens.map((item) => ({
        produto_id: item.productId,
        quantidade: item.quantity,
        preco_custo: item.cost,
      })),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/entradas-notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Nota lançada com sucesso!");
        closeAddModal();
        const newEntryData = await response.json();
        setEntries([...entries, newEntryData]);
      } else {
        const errorData = await response.json();
        alert(`Erro ao lançar nota: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao lançar nota.");
    }
  };

  return (
    <Container>
      <Button onClick={openAddModal}>Lançar Nota</Button>
      <h1>Entradas de Compras</h1>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Data</TableHeader>
            <TableHeader>Total (R$)</TableHeader>
            <TableHeader>Filial</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Ações</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            // Verificação de segurança
            if (!entry || !entry.entrada || !entry.entrada.id) {
              console.warn(`Entrada inválida encontrada na posição ${index}`, entry);
              return null; // Ignora entradas inválidas
            }

            return (
              <TableRow key={entry.entrada.id}>
                <TableCell>{entry.entrada.id}</TableCell>
                <TableCell>
                  {new Date(entry.entrada.data_entrada).toLocaleDateString()}
                </TableCell>
                <TableCell>R$ {parseFloat(entry.entrada.total).toFixed(2)}</TableCell>
                <TableCell>{entry.entrada.filial_nome}</TableCell>
                <TableCell>{entry.entrada.fornecedor_nome}</TableCell>
                <TableCell>
                  <Button onClick={() => openModal(entry.itens)}>Ver Itens</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>

      </Table>

      {isModalOpen && (
        <ModalContainer onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Itens da Entrada</h2>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>Produto</TableHeader>
                  <TableHeader>Quantidade</TableHeader>
                  <TableHeader>Custo</TableHeader>
                  <TableHeader>Subtotal</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.produto_nome}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>R$ {parseFloat(item.preco_custo).toFixed(2)}</TableCell>
                    <TableCell>
                      R$ {(item.quantidade * item.preco_custo).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            <Button onClick={closeModal}>Fechar</Button>
          </ModalContent>
        </ModalContainer>
      )}

      {isAddModalOpen && (
        <ModalContainer onClick={closeAddModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Lançar Nota</h2>
            <AddForm>
              <Select
                value={newEntry.branchId}
                onChange={(e) =>
                  setNewEntry((prev) => ({ ...prev, branchId: e.target.value }))
                }
              >
                <option value="">Selecione a Filial</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.nome}
                  </option>
                ))}
              </Select>

              <Input
                placeholder="Pesquisar Fornecedor"
                value={supplierSearch} // Mostra o texto que o usuário está digitando
                onChange={(e) => {
                  setSupplierSearch(e.target.value); // Atualiza o texto do input
                  filterSuppliers(e.target.value); // Atualiza as sugestões
                }}
              />
              <SuggestionsList>
                {filteredSuppliers.map((supplier) => (
                  <li
                    key={supplier.id}
                    onClick={() => {
                      setNewEntry((prev) => ({
                        ...prev,
                        supplierId: supplier.id,
                        supplierName: supplier.nome,
                        supplierCnpj: supplier.cnpj,
                      }));
                      setSupplierSearch(""); // Limpa o texto do input
                      setFilteredSuppliers([]); // Limpa as sugestões
                    }}
                  >
                    {supplier.nome} - {supplier.cnpj}
                  </li>
                ))}
              </SuggestionsList>

              {/* Exibir o fornecedor selecionado */}
              {newEntry.supplierName && (
                <p>
                  <strong>Fornecedor Selecionado:</strong> {newEntry.supplierName} -{" "}
                  {newEntry.supplierCnpj}
                </p>
              )}
              <h3>Adicionar Item</h3>
              <Input
                placeholder="Pesquisar Produto"
                value={productSearch} // Mostra o texto que o usuário está digitando
                onChange={(e) => {
                  setProductSearch(e.target.value); // Atualiza o texto do input
                  filterProducts(e.target.value); // Atualiza as sugestões
                }}
              />
              <SuggestionsList>
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => {
                      setNewItem((prev) => ({
                        ...prev,
                        productId: product.id,
                        productName: product.nome,
                        barcode: product.codigo_barras,
                        imagem: product.imagem, // Inclui a imagem base64 do produto
                      }));
                      setProductSearch(""); // Limpa o texto do input
                      setFilteredProducts([]); // Limpa as sugestões
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {product.imagem ? (
                        <img
                          src={`data:image/png;base64,${product.imagem}`} // Exibe a imagem em formato base64
                          alt="Produto"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginRight: "10px",
                          }}
                        />
                      ) : (
                        <span style={{ marginRight: "10px" }}>Sem imagem</span> // Fallback para produtos sem imagem
                      )}
                      <span>
                        {product.nome} - {product.codigo_barras}
                      </span>
                    </div>
                  </li>
                ))}
              </SuggestionsList>


              {/* Exibir o produto selecionado */}
              {newItem.productName && (
                <p>
                  <strong>Produto Selecionado:</strong> {newItem.productName} -{" "}
                  {newItem.barcode}
                </p>
              )}

              <Input
                type="number"
                placeholder="Quantidade"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
                }
              />
              <Input
                type="number"
                placeholder="Custo"
                value={newItem.cost}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, cost: e.target.value }))
                }
              />
              <Button onClick={addItemToNewEntry}>
                {editItemIndex !== null ? "Alterar Item" : "Adicionar Item"}
              </Button>

              <Table>
                <thead>
                  <TableRow>
                    <TableHeader>Imagem</TableHeader> {/* Adiciona a coluna de imagem */}
                    <TableHeader>Produto</TableHeader>
                    <TableHeader>Quantidade</TableHeader>
                    <TableHeader>Custo</TableHeader>
                    <TableHeader>Subtotal</TableHeader>
                    <TableHeader>Ações</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {newEntry.itens.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.imagem ? (
                          <img
                            src={`data:image/png;base64,${item.imagem}`} // Exibe a imagem em formato base64
                            alt={item.productName}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <span>Sem imagem</span> // Fallback caso a imagem não esteja disponível
                        )}
                      </TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>R$ {parseFloat(item.cost).toFixed(2)}</TableCell>
                      <TableCell>
                        R$ {(item.quantity * item.cost).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => editItem(index)}>Editar</Button>
                        <Button
                          style={{ background: "#FF6B6B" }}
                          onClick={() => deleteItem(index)}
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>


              <h3>Total: R$ {newEntry.total}</h3>
              <Button onClick={submitNewEntry}>Salvar Nota</Button>
              <Button onClick={closeAddModal}>Fechar</Button>
            </AddForm>
          </ModalContent>
        </ModalContainer>
      )}
    </Container>
  );
};

export default Entradas;
