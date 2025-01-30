import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  LeftSection,
  RightSection,
  HighlightedProduct,
  InputGroup,
  Button,
  TotalDisplay,
  TotalContainer,
  ProductModal,
  ProductModalContent,
  ProductCard,
  IconButton,
  IconButtonGroup,
  ProductTableWrapper,
  OperatorInfo,
  ModalOverlay,
  SettingsModal,
  SettingsIcon,
  SettingsLabel,
  SettingsSelect,
  SettingsInput,
  SettingsCheckbox,
  SettingsButton,
} from "./styles";
import { FaTrash, FaShoppingCart, FaSearch, FaBarcode, FaMoneyBillWave, FaTimes, FaUndo, FaArrowLeft, FaPercentage, FaTag, FaTags, FaCog } from "react-icons/fa";
import { CategorySection } from "./styles";
import { ProductGrid } from "./styles";
import { CloseButton } from "./styles";
import { DivDesc } from "./styles";
import api from "../../../api";

const PDV = () => {
  const [selectedItems, setSelectedItems] = useState([]); // Itens selecionados para exclusão
  const [isCancelItemModalOpen, setIsCancelItemModalOpen] = useState(false); // Controle do modal de cancelamento
  const [cancelSearch, setCancelSearch] = useState(""); // Pesquisa no modal de cancelamento
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("Dinheiro");
  const [timeout, setTimeout] = useState(5);
  const [virtualKeyboard, setVirtualKeyboard] = useState(false);
  const [alertSound, setAlertSound] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);
  const [pdvLayout, setPdvLayout] = useState("Padrão");

  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [cart, setCart] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [highlightedProduct, setHighlightedProduct] = useState({
    nome: "Nenhum produto selecionado",
  });
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(""); // Valor do pagamento atual
  const [paymentHistory, setPaymentHistory] = useState([]); // Histórico de pagamentos
  const [remainingTotal, setRemainingTotal] = useState(""); // Valor restante a ser pago
  const [totalPaid, setTotalPaid] = useState(0); // Valor total pago
  const [change, setChange] = useState(0); // Valor de troco
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isTotalDiscountModalOpen, setIsTotalDiscountModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  

  const operatorNumber = "00123"; // Número do operador (exemplo)
  const operatorName = "João Silva"; // Nome do operador (exemplo)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Busca os produtos da API ao carregar o componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/produtos"); // Altere para o endpoint correto
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Recalcula o total geral considerando os descontos
    if (cart.length > 0) {
      const newTotal = cart.reduce((sum, item) => sum + (item.finalTotal || item.total), 0);
      setTotalGeneral(newTotal);
    } else {
      setTotalGeneral(0);
    }
  }, [cart]);

  const applyItemDiscount = () => {
    if (!selectedItem) return;

    setCart(cart.map((item) => {
      if (item.id === Number(selectedItem)) {
        const itemDiscount = discountType === "percentage" ? (discountValue / 100) * item.total : discountValue;
        return {
          ...item,
          discountApplied: (item.discountApplied || 0) + itemDiscount,
          finalTotal: Math.max(0, (item.finalTotal || item.total) - itemDiscount),
        };
      }
      return item;
    }));

    setIsDiscountModalOpen(false);
  };

  const applyTotalDiscount = () => {
    if (totalGeneral > 0) {
      const discountAmount = discountType === "percentage" ? (discountValue / 100) * totalGeneral : discountValue;
      setTotalGeneral(Math.max(0, totalGeneral - discountAmount));
    }
    setIsTotalDiscountModalOpen(false);
  };



  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const confirmCancelItems = () => {
    const updatedCart = cart.filter(
      (product) => !selectedItems.includes(product.id)
    );
    setCart(updatedCart);
    setTotalGeneral(
      updatedCart.reduce((sum, product) => sum + product.total, 0)
    ); // Recalcula o total geral
    setSelectedItems([]); // Reseta os itens selecionados
    setIsCancelItemModalOpen(false); // Fecha o modal
    alert("Itens removidos com sucesso!");
  };

  const finalizeSale = () => {
    if (remainingTotal > 0) {
      alert(
        "Ainda há um saldo restante. Finalize os pagamentos antes de concluir."
      );
      return;
    }

    alert(
      `Compra finalizada com sucesso!\nMétodos de Pagamento:\n${paymentHistory
        .map((p) => `${p.method}: R$ ${p.amount.toFixed(2)}`)
        .join("\n")}`
    );
    setCart([]);
    setTotalGeneral(0);
    setRemainingTotal(0);
    setPaymentMethod("");
    setPaymentAmount(0);
    setPaymentHistory([]);
    setIsPaymentModalOpen(false);
  };

  const handlePartialPayment = () => {
    if (paymentAmount <= 0) {
      alert("Insira um valor válido para pagamento.");
      return;
    }

    // Atualizar o total pago
    const newTotalPaid = totalPaid + paymentAmount;

    if (newTotalPaid >= remainingTotal) {
      setChange(newTotalPaid - remainingTotal); // Calcula o troco
      setRemainingTotal(0); // Zera o valor restante
    } else {
      setRemainingTotal(remainingTotal - paymentAmount); // Atualiza o restante
      setChange(0); // Não há troco
    }

    // Adicionar o pagamento ao histórico
    setPaymentHistory([
      ...paymentHistory,
      { method: paymentMethod, amount: paymentAmount },
    ]);

    // Atualiza o valor total pago
    setTotalPaid(newTotalPaid);

    // Resetar os valores
    setPaymentMethod("");
    setPaymentAmount("");
  };

  const openPaymentModal = () => {
    if (cart.length === 0) {
      alert("Adicione itens ao carrinho antes de totalizar a compra.");
      return;
    }

    // Garante que o total a pagar leve em conta os descontos aplicados
    const totalComDescontos = cart.reduce(
      (sum, item) => sum + (item.finalTotal ?? item.total), 0
    );

    setRemainingTotal(totalComDescontos);
    setIsPaymentModalOpen(true);
  };


  const calculateTotalItem = () => {
    setTotalItem(quantity * unitPrice);
  };

  const cancelSale = () => {
    if (cart.length === 0) {
      alert("Adicione itens ao carrinho antes de cancelar a compra.");
    } else {
      setCart([]); // Limpa o carrinho
      setTotalGeneral(0); // Reseta o total geral
      setRemainingTotal(0); // Reseta o valor restante
      setTotalPaid(0); // Reseta o total pago
      setChange(0); // Reseta o troco
      setPaymentHistory([]); // Limpa o histórico de pagamentos
      setPaymentMethod(""); // Reseta o método de pagamento
      setPaymentAmount(""); // Reseta o valor de pagamento atual
      alert("Venda cancelada com sucesso!"); // Mensagem de confirmação
    }
  };

  const handleBarcodeEnter = (e) => {
    if (e.key === "Enter") {
      const product = products.find((p) => p.codigo_barras === barcode);
  
      if (product) {
        const existingProduct = cart.find((item) => item.id === product.id);
  
        let updatedCart;
        if (existingProduct) {
          updatedCart = cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1, // Incrementa a quantidade em 1
                  total: item.total + product.preco_venda, // Atualiza o total
                }
              : item
          );
        } else {
          updatedCart = [
            ...cart,
            {
              ...product,
              quantity: 1,
              total: product.preco_venda,
            },
          ];
        }
  
        setCart(updatedCart);
  
        // Atualiza o produto destacado IMEDIATAMENTE
        setHighlightedProduct({
          ...product,
          quantity: 1,
          total: product.preco_venda,
        });
  
        // Atualiza o total geral
        setTotalGeneral(
          updatedCart.reduce((sum, item) => sum + (item.finalTotal || item.total), 0)
        );
  
        // Limpa campos de entrada
        setBarcode("");
        setQuantity(1);
      } else {
        alert("Produto não encontrado.");
        setBarcode("");
      }
    }
  };
  
  const addToCart = () => {
    if (!highlightedProduct || !highlightedProduct.id) {
      alert("Selecione um produto antes de adicionar.");
      return;
    }
  
    const existingProduct = cart.find((item) => item.id === highlightedProduct.id);
  
    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === highlightedProduct.id
          ? {
              ...item,
              quantity: item.quantity + quantity, // Incrementa a quantidade
              total: item.total + highlightedProduct.preco_venda * quantity, // Atualiza o total
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...highlightedProduct,
          quantity,
          total: highlightedProduct.preco_venda * quantity, // Corrigindo cálculo
        },
      ];
    }
  
    setCart(updatedCart);
    setTotalGeneral(
      updatedCart.reduce((sum, item) => sum + (item.finalTotal || item.total), 0)
    );
    setRemainingTotal(totalGeneral - totalPaid); // Ajusta o valor restante com base no total pago
  
    // **Manter o último produto adicionado visível**
    setHighlightedProduct({
      ...highlightedProduct,
      quantity,
      total: highlightedProduct.preco_venda * quantity,
    });
  
    // **Não resetar `highlightedProduct`, apenas limpar os campos de input**
    setBarcode("");
    setQuantity(1);
  };
  
  

  const resetFields = () => {
    setBarcode("");
    setQuantity(1);
    setUnitPrice(0);
    setTotalItem(0);
    // Redefine para o produto padrão
    setHighlightedProduct({ nome: "Nenhum produto selecionado" });
  };

  const cancelPayment = () => {
    setRemainingTotal(totalGeneral); // Reseta o total restante para o valor total original
    setPaymentHistory([]); // Limpa o histórico de pagamentos
    setPaymentMethod(""); // Reseta o método de pagamento
    setPaymentAmount(""); // Reseta o valor do pagamento
    setIsPaymentModalOpen(false); // Fecha o modal
  };

  const removeFromCart = (id) => {
    const item = cart.find((product) => product.id === id);
    setCart(cart.filter((product) => product.id !== id));
    setTotalGeneral(totalGeneral - item.total);
  };

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DivDesc>
        {highlightedProduct && (
          <HighlightedProduct>
            <h3>{highlightedProduct.nome}</h3>
          </HighlightedProduct>
        )}
      </DivDesc>

      <SettingsIcon onClick={() => setIsSettingsModalOpen(true)}>
        <FaCog />
      </SettingsIcon>

      <Container>

    
       {/* Modal de Configuração */}
       {isSettingsModalOpen && (
        <ModalOverlay>
          <SettingsModal>
            <h2>Configurações do PDV</h2>

            <SettingsLabel>Método de Pagamento Padrão:</SettingsLabel>
            <SettingsSelect 
              value={defaultPaymentMethod}
              onChange={(e) => setDefaultPaymentMethod(e.target.value)}
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Pix">Pix</option>
            </SettingsSelect>

            <SettingsLabel>Tempo de Inatividade (minutos):</SettingsLabel>
            <SettingsInput 
              type="number"
              value={timeout}
              min="1"
              onChange={(e) => setTimeout(Number(e.target.value))}
            />

            <SettingsLabel>Teclado Virtual:</SettingsLabel>
            <SettingsCheckbox 
              type="checkbox" 
              checked={virtualKeyboard} 
              onChange={() => setVirtualKeyboard(!virtualKeyboard)}
            /> Ativar

            <SettingsLabel>Som de Alerta:</SettingsLabel>
            <SettingsCheckbox 
              type="checkbox" 
              checked={alertSound} 
              onChange={() => setAlertSound(!alertSound)}
            /> Ativar

            <SettingsLabel>Impressão Automática de Recibo:</SettingsLabel>
            <SettingsCheckbox 
              type="checkbox" 
              checked={autoPrint} 
              onChange={() => setAutoPrint(!autoPrint)}
            /> Ativar

            <SettingsLabel>Layout do PDV:</SettingsLabel>
            <SettingsSelect 
              value={pdvLayout} 
              onChange={(e) => setPdvLayout(e.target.value)}
            >
              <option value="Padrão">Padrão</option>
              <option value="Compacto">Compacto</option>
              <option value="Tela Cheia">Tela Cheia</option>
            </SettingsSelect>

            <SettingsButton onClick={() => setIsSettingsModalOpen(false)}>
              Salvar Configurações
            </SettingsButton>
          </SettingsModal>
        </ModalOverlay>
      )}

        <LeftSection>
          <h2>Informações do Produto</h2>

          <InputGroup>
            <label>Código de Barras:</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleBarcodeEnter}
              placeholder="Leia ou digite o código"
            />
          </InputGroup>
          <InputGroup>
            <label>Quantidade:</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              onBlur={calculateTotalItem}
            />
          </InputGroup>
          <InputGroup>
            <label>Valor Unitário:</label>
            <input type="number" value={unitPrice} readOnly />
          </InputGroup>
          <InputGroup>
            <label>Total do Item:</label>
            <input type="text" value={`R$ ${totalItem.toFixed(2)}`} readOnly />
          </InputGroup>


          <IconButtonGroup>
            <IconButton onClick={() => setIsDiscountModalOpen(true)}>
              <FaTag />
            </IconButton>
            <IconButton onClick={() => setIsTotalDiscountModalOpen(true)}>
              <FaTags />
            </IconButton>

            <IconButton $bgcolor="#FF9800" onClick={addToCart}><FaShoppingCart /></IconButton>
            <IconButton onClick={() => setIsProductModalOpen(true)}><FaSearch /></IconButton>
            <IconButton onClick={() => openPaymentModal()}><FaMoneyBillWave /></IconButton>
            <IconButton onClick={cancelSale} style={{ backgroundColor: "red" }}><FaTimes /></IconButton>
            <IconButton onClick={() => setIsCancelItemModalOpen(true)} disabled={cart.length === 0} style={{ backgroundColor: cart.length > 0 ? "#ffa500" : "red", color: "white", cursor: cart.length > 0 ? "pointer" : "not-allowed" }}>
              <FaUndo />
            </IconButton>
          </IconButtonGroup>

        </LeftSection>
        <RightSection>
          <TotalContainer>
            <TotalDisplay>
              Total Geral: R$ {totalGeneral.toFixed(2)}
            </TotalDisplay>
          </TotalContainer>
          <div style={{ maxHeight: "400px", overflowY: "auto", width: "100%" }}>
            <ProductTableWrapper>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Código de Barras</th>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Preço Total</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={`data:image/jpeg;base64,${product.imagem}`} alt={product.nome} />
                    </td>
                    <td>{product.codigo_barras}</td>
                    <td>{product.nome}</td>
                    <td>{product.quantity}</td>
                    <td>R$ {product.total.toFixed(2)}</td>
                    <td>
                      <IconButton onClick={() => setCart(cart.filter((p) => p.id !== product.id))}>
                        <FaTrash />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ProductTableWrapper>
          </div>

        </RightSection>


        {isDiscountModalOpen && (
          <ProductModal>
            <ProductModalContent>
              <CloseButton onClick={() => setIsDiscountModalOpen(false)}>X</CloseButton>
              <h2>Aplicar Desconto no Item</h2>
              <InputGroup>
                <label>Selecionar Produto:</label>
                <select onChange={(e) => setSelectedItem(e.target.value)}>
                  <option value="">Escolha um produto</option>
                  {cart.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup>
                <label>Tipo de Desconto:</label>
                <select onChange={(e) => setDiscountType(e.target.value)}>
                  <option value="percentage">Porcentagem</option>
                  <option value="value">Valor Fixo</option>
                </select>
              </InputGroup>
              <InputGroup>
                <label>Valor do Desconto:</label>
                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
              </InputGroup>
              <IconButton onClick={applyItemDiscount}>
                OK
              </IconButton>
            </ProductModalContent>
          </ProductModal>
        )}

        {isTotalDiscountModalOpen && (
          <ProductModal>
            <ProductModalContent>
              <CloseButton onClick={() => setIsTotalDiscountModalOpen(false)}>X</CloseButton>
              <h2>Aplicar Desconto no Total</h2>
              <InputGroup>
                <label>Tipo de Desconto:</label>
                <select onChange={(e) => setDiscountType(e.target.value)}>
                  <option value="percentage">Porcentagem</option>
                  <option value="value">Valor Fixo</option>
                </select>
              </InputGroup>
              <InputGroup>
                <label>Valor do Desconto:</label>
                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
              </InputGroup>
              <IconButton onClick={applyTotalDiscount}>
                OK
              </IconButton>
            </ProductModalContent>
          </ProductModal>
        )}

        {isProductModalOpen && (
          <ProductModal>
            <ProductModalContent>
              {/* Botão para fechar o modal */}
              <CloseButton onClick={() => setIsProductModalOpen(false)}>
                X
              </CloseButton>
              <h2>Escolha um Produto</h2>

              {/* Menu de Seleção de Categorias */}
              <select
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <option value="">Todas as Categorias</option>
                {Object.keys(
                  products.reduce((acc, product) => {
                    const category = product.categoria_nome || "Sem Categoria";
                    acc[category] = true;
                    return acc;
                  }, {})
                ).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Campo de Pesquisa */}
              <input
                type="text"
                placeholder="Pesquisar produtos"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />

              {/* Produtos Filtrados por Categoria */}
              {Object.entries(
                products
                  .filter(
                    (product) =>
                      (selectedCategory === "" ||
                        product.categoria_nome === selectedCategory) &&
                      product.nome.toLowerCase().includes(search.toLowerCase())
                  ) // Aplica o filtro de pesquisa e de categoria
                  .reduce((acc, product) => {
                    const category = product.categoria_nome || "Sem Categoria";
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(product);
                    return acc;
                  }, {})
              ).map(([categoryName, categoryProducts]) => (
                <CategorySection key={categoryName}>
                  <h3>{categoryName}</h3>
                  <ProductGrid>
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id}>
                        <img
                          src={`data:image/jpeg;base64,${product.imagem}`}
                          alt={product.nome}
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <h4>{product.nome}</h4>
                        <p>R$ {product.preco_venda}</p>
                        <button
                          onClick={() => {
                            setHighlightedProduct({
                              ...product,
                              quantity,
                              total: product.preco_venda * quantity,
                            });
                            setUnitPrice(product.preco_venda);
                            setIsProductModalOpen(false);
                          }}
                        >
                          Selecionar
                        </button>
                      </ProductCard>
                    ))}
                  </ProductGrid>
                </CategorySection>
              ))}
            </ProductModalContent>
          </ProductModal>
        )}

        {isCancelItemModalOpen && (
          <ProductModal>
            <ProductModalContent>
              <CloseButton onClick={() => setIsCancelItemModalOpen(false)}>
                X
              </CloseButton>
              <h2>Cancelar Itens</h2>
              <input
                type="text"
                placeholder="Pesquisar no carrinho"
                value={cancelSearch}
                onChange={(e) => setCancelSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                {cart
                  .filter((product) =>
                    product.nome
                      .toLowerCase()
                      .includes(cancelSearch.toLowerCase())
                  )
                  .map((product) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {/* Imagem do Produto */}
                      <img
                        src={`data:image/jpeg;base64,${product.imagem}`}
                        alt={product.nome}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "8px",
                          marginRight: "10px",
                        }}
                      />
                      {/* Informações do Produto */}
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: "bold" }}>
                          {product.nome}
                        </p>
                        <p style={{ margin: "5px 0", color: "#555" }}>
                          R$ {product.total.toFixed(2)}
                        </p>
                      </div>
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => toggleSelectItem(product.id)}
                        style={{ width: "20px", height: "20px" }}
                      />
                    </div>
                  ))}
              </div>
              <Button
                onClick={confirmCancelItems}
                style={{
                  marginTop: "20px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Confirmar Exclusão
              </Button>
            </ProductModalContent>
          </ProductModal>
        )}

        {/* Modal de Pagamento */}
        {isPaymentModalOpen && (
          <ProductModal>
            <ProductModalContent>
              <CloseButton onClick={() => setIsPaymentModalOpen(false)}>
                X
              </CloseButton>
              <h2>Totalizar Compra</h2>
              <p>
                <strong>Total Restante:</strong> R$ {remainingTotal.toFixed(2)}
              </p>
              <p>
                <strong>Total Pago:</strong> R$ {totalPaid.toFixed(2)}
              </p>
              {change > 0 && (
                <p>
                  <strong>Troco:</strong> R$ {change.toFixed(2)}
                </p>
              )}
              <div>
                <label>Método de Pagamento:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                </select>
              </div>
              <div style={{ marginTop: "10px" }}>
                <label>Valor do Pagamento:</label>
                <input
                  type="number"
                  value={paymentAmount === "" ? "" : paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <Button
                onClick={handlePartialPayment}
                style={{ marginTop: "20px" }}
              >
                Confirmar Pagamento
              </Button>
              <Button
                onClick={finalizeSale}
                disabled={remainingTotal > 0}
                style={{ marginTop: "20px" }}
              >
                Finalizar Compra
              </Button>
              <Button
                onClick={cancelPayment}
                style={{
                  marginTop: "20px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Cancelar Pagamento
              </Button>

              {/* Histórico de Pagamentos */}
              {paymentHistory.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Pagamentos Realizados:</h3>
                  <ul>
                    {paymentHistory.map((payment, index) => (
                      <li key={index}>
                        {payment.method}: R$ {payment.amount.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ProductModalContent>
          </ProductModal>
        )}
        <OperatorInfo>
          Operador: {operatorNumber} - {operatorName} | Data:{" "}
          {currentTime.toLocaleDateString()} | Hora:{" "}
          {currentTime.toLocaleTimeString()}
        </OperatorInfo>
      </Container>
    </>
  );
};

export default PDV;
