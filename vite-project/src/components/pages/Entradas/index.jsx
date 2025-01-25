import { useEffect, useState } from "react";
import {
  ModalContainer,
  ModalContent,
  AddForm,
  Input,
  SuggestionsList,
  CloseButton,
  TableContainer,
  AddFormContainer,
  SelectedProductContainer,
  ProductDetails,
  ProductImage,
  ActionIcon,
  ItemsModalContainer,
  ItemsModalContent,
  ItemsTable,
} from "./styles";

import {
  Container,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Button,
  Notification,
  Select,
  LabelContainer,
  ConfirmModalContainer,
  ConfirmModalContent,
  ConfirmButton,
  ConfirmCancelButton,
  ConfirmButtonContainer
} from '../../../styles/utils'
import { useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";


const Entradas = () => {
  const [filters, setFilters] = useState({
    branch: "",
    supplier: "",
    minValue: "",
    maxValue: "",
  });
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
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const productSearchRef = useRef(null);
  const [notification, setNotification] = useState("");
  const [highlightedSupplierIndex, setHighlightedSupplierIndex] = useState(-1); // Índice destacado para fornecedores
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(-1); // Índice destacado para produtos


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

  const filterEntries = () => {
    return entries.filter((entry) => {
      const { branch, supplier, minValue, maxValue } = filters;

      const filialNome = entry.entrada?.filial_nome || ""; // Garante que não será undefined
      const fornecedorNome = entry.entrada?.fornecedor_nome || ""; // Garante que não será undefined

      const matchesBranch = !branch || filialNome.toLowerCase().includes(branch.toLowerCase());
      const matchesSupplier = !supplier || fornecedorNome.toLowerCase().includes(supplier.toLowerCase());
      const matchesMinValue = !minValue || entry.entrada.total >= parseFloat(minValue);
      const matchesMaxValue = !maxValue || entry.entrada.total <= parseFloat(maxValue);

      return matchesBranch && matchesSupplier && matchesMinValue && matchesMaxValue;
    });
  };


  const openConfirmDeleteModal = (entry) => {
    setEntryToDelete(entry);
    setIsConfirmDeleteOpen(true);
  };

  // Função para confirmar a exclusão
  const handleDeleteConfirmed = async () => {
    if (!entryToDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/entradas/${entryToDelete.id}/cancelar`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (response.ok) {
        setEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.entrada.id !== entryToDelete.id)
        );
        setNotification({ message: data.message, type: "success" });
      } else {
        setNotification({ message: data.error, type: "error" });
      }
    } catch (error) {
      console.error("Erro ao cancelar entrada:", error);
      setNotification({ message: "Erro ao cancelar entrada.", type: "error" });
    } finally {
      // Fecha o modal e limpa a entrada selecionada
      setIsConfirmDeleteOpen(false);
      setEntryToDelete(null);
    }
  };




  const handleSupplierKeyDown = (e) => {
    if (filteredSuppliers.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedSupplierIndex((prevIndex) =>
        prevIndex < filteredSuppliers.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedSupplierIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && highlightedSupplierIndex >= 0) {
      const selectedSupplier = filteredSuppliers[highlightedSupplierIndex];
      setNewEntry((prev) => ({
        ...prev,
        supplierId: selectedSupplier.id,
        supplierName: selectedSupplier.nome,
        supplierCnpj: selectedSupplier.cnpj,
      }));
      setSupplierSearch(""); // Limpa o campo
      setFilteredSuppliers([]); // Remove sugestões
    }
  };

  const handleProductKeyDown = (e) => {
    if (filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedProductIndex((prevIndex) =>
        prevIndex < filteredProducts.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedProductIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && highlightedProductIndex >= 0) {
      const selectedProduct = filteredProducts[highlightedProductIndex];
      setNewItem((prev) => ({
        ...prev,
        productId: selectedProduct.id,
        productName: selectedProduct.nome,
        barcode: selectedProduct.codigo_barras,
        imagem: selectedProduct.imagem,
      }));
      setProductSearch(""); // Limpa o campo
      setFilteredProducts([]); // Remove sugestões
    }
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesRes, suppliersRes, productsRes, branchesRes] =
          await Promise.all([
            fetch("http://127.0.0.1:5000/entradas"),
            fetch("http://127.0.0.1:5000/fornecedores"),
            fetch("http://127.0.0.1:5000/produtos"),
            fetch("http://127.0.0.1:5000/filiais"),
          ]);

        const [entriesData, suppliersData, productsData, branchesData] =
          await Promise.all([
            entriesRes.json(),
            suppliersRes.json(),
            productsRes.json(),
            branchesRes.json(),
          ]);

        // Validar se entriesData é um array e contém entradas válidas
        if (!Array.isArray(entriesData)) {
          console.error("Entradas inválidas recebidas:", entriesData);
          setEntries([]);
          return;
        }

        setEntries(entriesData);
        console.log("Entries Data:", entriesData);
        setSuppliers(suppliersData);
        setProducts(productsData);
        setBranches(branchesData);
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
      showNotification("Nenhum item para exibir.", "error");
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
    setNewItem({
      productId: "",
      productName: "",
      barcode: "",
      quantity: "",
      cost: "",
      imagem: "", // Garante que a imagem também seja zerada
    });
    setSupplierSearch("");
    setProductSearch("");
    setFilteredSuppliers([]);
    setFilteredProducts([]);
    setHighlightedSupplierIndex(-1);
    setHighlightedProductIndex(-1);
  };



  const addItemToNewEntry = () => {
    if (!newItem.productId || !newItem.quantity || !newItem.cost) {
      showNotification("Por favor, preencha todos os campos do item.", "error");
      return;
    }

    // Verifica duplicidade apenas quando não estamos no modo de edição
    if (editItemIndex === null) {
      const existingItem = newEntry.itens.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        showNotification("Este produto já foi adicionado à lista.", "error");
        return;
      }
    }

    const updatedItems = [...newEntry.itens];
    if (editItemIndex !== null) {
      // Atualiza o item existente na posição correta
      updatedItems[editItemIndex] = { ...newItem };
    } else {
      // Adiciona um novo item
      updatedItems.push({ ...newItem });
    }

    setNewEntry((prev) => ({
      ...prev,
      itens: updatedItems,
      branchId: prev.branchId, // Mantém a filial selecionada
    }));

    setNewItem({
      productId: "",
      productName: "",
      barcode: "",
      quantity: "",
      cost: "",
    });

    setEditItemIndex(null); // Sai do modo de edição

    // Retorna o foco para o campo de pesquisa de produtos
    productSearchRef.current.focus();
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
      showNotification("Por favor, preencha os campos obrigatórios.", "error");
      return;
    }

    const payload = {
      filial_id: newEntry.branchId,
      fornecedor_id: newEntry.supplierId,
      total: newEntry.total,
      observacoes: newEntry.observacoes,
      itens: newEntry.itens.map((item) => ({
        produto_id: item.productId,
        quantidade: parseInt(item.quantity, 10), // Converte para inteiro
        preco_custo: parseFloat(item.cost), // Converte para número
      })),
    };

    console.log("Payload enviado ao backend:", payload); // Log para depuração

    try {
      const response = await fetch("http://127.0.0.1:5000/entradas-notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newEntryData = await response.json();
        console.log("Resposta do backend:", newEntryData); // Log da resposta
        showNotification("Nota lançada com sucesso!", "success");
        closeAddModal();
        setEntries([...entries, newEntryData]);
      } else {
        const errorData = await response.json();
        console.error("Erro do backend:", errorData);
        showNotification(`Erro ao lançar nota: ${errorData.error}`, "error");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      showNotification("Erro ao lançar nota.", "error");
    }
  };



  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    // Remove a notificação automaticamente após 3 segundos
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };


  return (
    <Container>

      {/* Modal de Confirmação */}
      {isConfirmDeleteOpen && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Confirmar Exclusão</h2>
            <p>
              Tem certeza de que deseja excluir a entrada <br /> ID:{" "}
              {entryToDelete?.id}?
            </p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={handleDeleteConfirmed}>
                Sim, Excluir
              </ConfirmButton>
              <ConfirmCancelButton onClick={() => setIsConfirmDeleteOpen(false)}>
                Cancelar
              </ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}
      {notification && (
        <Notification type={notification.type}>{notification.message}</Notification>
      )}
      <h1>Entradas de Compras</h1>
      <Button onClick={openAddModal}>Lançar Nota</Button>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          placeholder="Filtrar por Filial"
          value={filters.branch}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, branch: e.target.value }))
          }
        />
        <Input
          placeholder="Filtrar por Fornecedor"
          value={filters.supplier}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, supplier: e.target.value }))
          }
        />
        <Input
          type="number"
          placeholder="Valor Mínimo"
          value={filters.minValue}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minValue: e.target.value }))
          }
        />
        <Input
          type="number"
          placeholder="Valor Máximo"
          value={filters.maxValue}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxValue: e.target.value }))
          }
        />
      </div>
      <TableContainer>
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
            {filterEntries().map((entry, index) => {
              if (!entry.entrada || !entry.entrada.id) {
                console.warn(`Entrada inválida no índice ${index}:`, entry);
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
                    <ActionIcon onClick={() => openModal(entry.itens)}>
                    <FaEdit size={16} style={{ color: "#FF9800" }} />
                    </ActionIcon>
                    <ActionIcon onClick={() => openConfirmDeleteModal(entry.entrada)}>
                      <FaTrash color="#e63946" />
                    </ActionIcon>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <ItemsModalContainer onClick={closeModal}>
          <ItemsModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Itens da Entrada</h2>
            <CloseButton onClick={closeModal}>Fechar</CloseButton>
            <ItemsTable>
              <thead>
                <TableRow>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Produto</TableHeader>
                  <TableHeader>Quantidade</TableHeader>
                  <TableHeader>Custo</TableHeader>
                  <TableHeader>Subtotal</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.produto_id}</TableCell>
                    <TableCell>{item.produto_nome}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>R$ {parseFloat(item.preco_custo).toFixed(2)}</TableCell>
                    <TableCell>
                      R$ {(item.quantidade * item.preco_custo).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </ItemsTable>
          </ItemsModalContent>
        </ItemsModalContainer>
      )}

      {isAddModalOpen && (
        <ModalContainer onClick={closeAddModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <AddFormContainer>
              <h2>Lançar Nota</h2>
              <AddForm>
                <LabelContainer>
                  <label>Filial:</label>
                  <select
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
                  </select>
                </LabelContainer>

                <Input
                  placeholder="Pesquisar Fornecedor"
                  value={supplierSearch}
                  onChange={(e) => {
                    setSupplierSearch(e.target.value);
                    filterSuppliers(e.target.value);
                  }}
                  onKeyDown={handleSupplierKeyDown} // Adiciona eventos de teclado
                />
                <SuggestionsList>
                  {filteredSuppliers.map((supplier, index) => (
                    <li
                      key={supplier.id}
                      onClick={() => {
                        setNewEntry((prev) => ({
                          ...prev,
                          supplierId: supplier.id,
                          supplierName: supplier.nome,
                          supplierCnpj: supplier.cnpj,
                        }));
                        setSupplierSearch("");
                        setFilteredSuppliers([]);
                      }}
                      style={{
                        backgroundColor:
                          index === highlightedSupplierIndex ? "#f3f4f6" : "transparent",
                        color: index === highlightedSupplierIndex ? "#1d4ed8" : "#000",
                      }}
                    >
                      {supplier.nome} - {supplier.cnpj}
                    </li>
                  ))}
                </SuggestionsList>

                {newEntry.supplierName && (
                  <p>
                    <strong>Fornecedor Selecionado:</strong> {newEntry.supplierName} -{" "}
                    {newEntry.supplierCnpj}
                  </p>
                )}

                <h3>Adicionar Item</h3>
                <Input
                  ref={productSearchRef}
                  placeholder="Pesquisar Produto"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    filterProducts(e.target.value);
                  }}
                  onKeyDown={handleProductKeyDown}
                />
                <SuggestionsList>
                  {filteredProducts.map((product, index) => (
                    <li
                      key={product.id}
                      onClick={() => {
                        setNewItem((prev) => ({
                          ...prev,
                          productId: product.id,
                          productName: product.nome,
                          barcode: product.codigo_barras,
                          imagem: product.imagem,
                        }));
                        setProductSearch("");
                        setFilteredProducts([]);
                        setHighlightedProductIndex(-1);
                      }}
                      style={{
                        backgroundColor: index === highlightedProductIndex ? "#f3f4f6" : "transparent",
                        color: index === highlightedProductIndex ? "#1d4ed8" : "#000",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {product.imagem ? (
                          <img
                            src={`data:image/png;base64,${product.imagem}`}
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
                          <span style={{ marginRight: "10px" }}>Sem imagem</span>
                        )}
                        <span>
                          {product.nome} - {product.codigo_barras}
                        </span>
                      </div>
                    </li>
                  ))}
                </SuggestionsList>

                {newItem.productName && (
                  <SelectedProductContainer>
                    <ProductDetails>
                      <h4>Produto Selecionado:</h4>
                      <p>
                        <strong>Nome:</strong> {newItem.productName}
                      </p>
                      <p>
                        <strong>Código de Barras:</strong> {newItem.barcode || "N/A"}
                      </p>
                    </ProductDetails>
                    {newItem.imagem && (
                      <ProductImage
                        src={`data:image/png;base64,${newItem.imagem}`}
                        alt="Imagem do Produto"
                      />
                    )}
                  </SelectedProductContainer>
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

                <Button onClick={submitNewEntry}>Salvar Nota</Button>
                <CloseButton onClick={closeAddModal}>X</CloseButton>
                <h3>Total: R$ {newEntry.total}</h3>
              </AddForm>
            </AddFormContainer>

            <TableContainer>
              <Table>
                <thead>
                  <TableRow>
                    <TableHeader>Imagem</TableHeader>
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
                            src={`data:image/png;base64,${item.imagem}`}
                            alt={item.productName}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <span>Sem imagem</span>
                        )}
                      </TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>R$ {parseFloat(item.cost).toFixed(2)}</TableCell>
                      <TableCell>
                        R$ {(item.quantity * item.cost).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <ActionIcon>
                          <FaEdit
                            size={16}
                            style={{
                              color: "#2563eb",
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            onClick={() => editItem(index)}
                          />
                        </ActionIcon>
                        <ActionIcon>
                          <FaTrash
                            size={16}
                            style={{
                              color: "#f43f5e",
                              cursor: "pointer",
                            }}
                            onClick={() => deleteItem(index)}
                          />
                        </ActionIcon>

                      </TableCell>

                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </ModalContent>

        </ModalContainer>
      )}
    </Container>
  );
};

export default Entradas;
