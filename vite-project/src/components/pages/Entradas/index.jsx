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
} from "./styles";

const Entradas = () => {
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
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

  useEffect(() => {
    // Função para buscar dados
    const fetchData = async () => {
      try {
        const [entriesRes, suppliersRes, productsRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/entradas"),
          fetch("http://127.0.0.1:5000/fornecedores"),
          fetch("http://127.0.0.1:5000/produtos"),
        ]);

        const [entriesData, suppliersData, productsData] = await Promise.all([
          entriesRes.json(),
          suppliersRes.json(),
          productsRes.json(),
        ]);

        setEntries(entriesData);
        setSuppliers(suppliersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Atualizar total automaticamente
  useEffect(() => {
    const total = newEntry.itens.reduce(
      (acc, item) => acc + item.quantity * item.cost,
      0
    );
    setNewEntry((prev) => ({ ...prev, total: total.toFixed(2) }));
  }, [newEntry.itens]);

  // Abrir e fechar modal de itens
  const openModal = (items) => {
    if (!items || items.length === 0) {
      alert("Nenhum item para exibir.");
      return;
    }
    setSelectedItems(items.map((item) => ({
      productName: item.produto_id, // Adapte conforme necessário
      quantity: item.quantidade,
      cost: item.preco_custo,
      subtotal: item.subtotal,
    })));
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setSelectedItems([]);
    setIsModalOpen(false);
  };

  // Abrir e fechar modal para adicionar nova entrada
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewEntry({
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

  const submitNewEntry = async () => {
    if (!newEntry.supplierId || newEntry.itens.length === 0) {
      alert("Por favor, selecione um fornecedor e adicione ao menos um item.");
      return;
    }

    const payload = {
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
        setEntries([...entries, newEntryData]); // Atualiza a lista de entradas
      } else {
        const errorData = await response.json();
        alert(`Erro ao lançar nota: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao lançar nota.");
    }
  };

  // Adicionar ou alterar item na lista
  const addItemToNewEntry = () => {
    // Verificar se o produto já foi adicionado
    const existingIndex = newEntry.itens.findIndex(
      (item) => item.productId === newItem.productId
    );

    if (existingIndex !== -1 && editItemIndex === null) {
      alert(
        "O produto já foi adicionado. Altere o item existente se necessário."
      );
      return;
    }

    if (newItem.productId && newItem.quantity && newItem.cost) {
      if (editItemIndex !== null) {
        // Atualizar item existente
        const updatedItems = [...newEntry.itens];
        updatedItems[editItemIndex] = { ...newItem };
        setNewEntry((prev) => ({ ...prev, itens: updatedItems }));
        setEditItemIndex(null);
      } else {
        // Adicionar novo item
        setNewEntry((prev) => ({
          ...prev,
          itens: [...prev.itens, { ...newItem }],
        }));
      }
      setNewItem({
        productId: "",
        productName: "",
        barcode: "",
        quantity: "",
        cost: "",
      });
    }
  };

  // Editar item da lista
  const editItem = (index) => {
    setNewItem(newEntry.itens[index]);
    setEditItemIndex(index);
  };

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

  const cancelEntry = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta entrada?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/entradas/${id}/cancelar`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Entrada cancelada com sucesso.");
        // Remover a entrada da tabela no estado
        setEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.entrada.id !== id)
        );
      } else {
        const errorData = await response.json();
        alert(`Erro ao cancelar entrada: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao cancelar entrada:", error);
      alert("Erro ao cancelar entrada. Tente novamente.");
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
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Itens</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            if (!entry || !entry.entrada) {
              console.warn(
                `Entrada inválida encontrada na posição ${index}`,
                entry
              );
              return null; // Ignora entradas inválidas
            }

            return (
              <TableRow key={entry.entrada.id}>
                <TableCell>{entry.entrada.id}</TableCell>
                <TableCell>
                  {new Date(entry.entrada.data_entrada).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  R$ {parseFloat(entry.entrada.total).toFixed(2)}
                </TableCell>
                <TableCell>{entry.entrada.fornecedor_nome}</TableCell>
                <TableCell>
                  <Button onClick={() => openModal(entry.itens)}>
                    Ver Itens
                  </Button>
                  <Button
                    onClick={() => cancelEntry(entry.entrada.id)}
                    style={{ marginLeft: "10px", background: "#FF6B6B" }}
                  >
                    Cancelar
                  </Button>
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
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>R$ {parseFloat(item.cost).toFixed(2)}</TableCell>
                    <TableCell>
                      R$ {(item.quantity * item.cost).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            <Button onClick={closeModal}>Fechar</Button>
          </ModalContent>
        </ModalContainer>
      )}

      {/* Modal para lançar nova entrada */}
      {isAddModalOpen && (
        <ModalContainer onClick={closeAddModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Lançar Nota</h2>
            <AddForm>
              {/* Pesquisa de Fornecedor */}
              <Input
                placeholder="Pesquisar Fornecedor"
                onChange={(e) => filterSuppliers(e.target.value)}
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
                      setFilteredSuppliers([]);
                    }}
                  >
                    {supplier.nome} - {supplier.cnpj}
                  </li>
                ))}
              </SuggestionsList>
              <p>
                <strong>Fornecedor:</strong> {newEntry.supplierName}
                <br />
                <strong>CNPJ:</strong> {newEntry.supplierCnpj}
              </p>

              {/* Pesquisa de Produto */}
              <h3>Adicionar Item</h3>
              <Input
                placeholder="Pesquisar Produto ou Código de Barras"
                onChange={(e) => filterProducts(e.target.value)}
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
                      }));
                      setFilteredProducts([]);
                    }}
                  >
                    {product.nome} - {product.codigo_barras}
                  </li>
                ))}
              </SuggestionsList>
              <p>
                <strong>Produto:</strong> {newItem.productName}
                <br />
                <strong>Código de Barras:</strong> {newItem.barcode}
              </p>
              <Input
                type="number"
                placeholder="Quantidade"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
                }
              />
              <Input
                type="text"
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
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.cost}</TableCell>
                      <TableCell>
                        {(item.quantity * item.cost).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => editItem(index)}>Editar</Button>
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
