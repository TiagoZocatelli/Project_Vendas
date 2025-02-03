import React, { useState, useEffect } from "react";
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
  Notification,
  PaymentModalContainer,
  ModalTitle,
  PaymentSelect,
  PaymentInput,
  ActionButton,
  PaymentHistoryContainer,
  PaymentHistoryText,
  PaymentHistoryList,
  ButtonGroup
} from "./styles";
import { FaTrash, FaShoppingCart, FaSearch, FaBarcode, FaMoneyBillWave, FaTimes, FaUndo, FaArrowLeft, FaPercentage, FaTag, FaTags, FaCog, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { CategorySection } from "./styles";
import { ProductGrid } from "./styles";
import { CloseButton } from "./styles";
import { DivDesc } from "./styles";
import api from "../../../api";
import {
  ConfirmModalContainer,
  ConfirmCancelButton,
  ConfirmButton,
  ConfirmModalContent,
  ConfirmButtonContainer
} from '../../../styles/utils'

const PDV = () => {


  const operatorNumber = localStorage.getItem("operador_id");
  const operatorName = localStorage.getItem("operador_nome");
  const operadorFilial = localStorage.getItem("operador_filial")

  const [selectedItems, setSelectedItems] = useState([]); // Itens selecionados para exclusão
  const [isCancelItemModalOpen, setIsCancelItemModalOpen] = useState(false); // Controle do modal de cancelamento
  const [cancelSearch, setCancelSearch] = useState(""); // Pesquisa no modal de cancelamento
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [autoPrint, setAutoPrint] = useState(false);
  const [message, setMessage] = useState("");

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
  const [isConfirmCancelSaleOpen, setIsConfirmCancelSaleOpen] = useState(false);
  const [isConfirmCancelItemOpen, setIsConfirmCancelItemOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await api.get("/formas_pagamento");
        setPaymentMethods(response.data);
      } catch (error) {
        showMessage("Erro ao buscar formas de pagamento.", "error");
      }
    };
    fetchPaymentMethods();
  }, []);

  // Busca os produtos da API ao carregar o componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/produtos"); // Altere para o endpoint correto
        setProducts(response.data);
      } catch (error) {
        showMessage(`Erro ao carregar produtos: ${error.message}`, "error");
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

  const openConfirmCancelSaleModal = () => setIsConfirmCancelSaleOpen(true);
  const closeConfirmCancelSaleModal = () => setIsConfirmCancelSaleOpen(false);

  const openConfirmCancelItemModal = () => setIsConfirmCancelItemOpen(true);
  const closeConfirmCancelItemModal = () => setIsConfirmCancelItemOpen(false);


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

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage(null); // Reseta a notificação após 3 segundos
    }, 5000);
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
    if (cart.length === 1) {
      showMessage("Existe apenas 1 item no carrinho necessario cancelar venda", "error");
      return
    } else {
      const updatedCart = cart.filter(product => !selectedItems.includes(product.id));
      setCart(updatedCart);
      setTotalGeneral(updatedCart.reduce((sum, product) => sum + product.total, 0)); // Recalcula o total geral
      setSelectedItems([]); // Reseta os itens selecionados
      showMessage("Itens removidos com sucesso!", "success");
      closeConfirmCancelItemModal();
    }
  };

  const finalizeSale = () => {
    if (remainingTotal > 0) {
      showMessage(
        "Ainda há um saldo restante. Finalize os pagamentos antes de concluir.", "error");
      return;
    }

    showMessage(
      `Compra finalizada com sucesso!\nMétodos de Pagamento:\n${paymentHistory
        .map((p) => `${p.method}: R$ ${p.amount.toFixed(2)}`)
        .join("\n")}`, "success");
    setCart([]);
    setTotalGeneral(0);
    setRemainingTotal(0);
    setPaymentMethod("");
    setPaymentAmount(0);
    setPaymentHistory([]);
    setIsPaymentModalOpen(false);
  };

  const handlePartialPayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      showMessage("Insira um valor válido para pagamento.", "error");
      return;
    }

    // Calcula o novo total pago
    const newTotalPaid = totalPaid + paymentAmount;
    const newRemainingTotal = Math.max(0, remainingTotal - paymentAmount); // Garante que não seja negativo
    const newChange = Math.max(0, newTotalPaid - totalGeneral); // Troco correto

    // Atualiza os estados corretamente
    setTotalPaid(newTotalPaid);
    setRemainingTotal(newRemainingTotal);
    setChange(newChange); // Define o troco se houver

    // Adiciona o pagamento ao histórico
    setPaymentHistory([
      ...paymentHistory,
      { method: paymentMethod, amount: paymentAmount },
    ]);

    // Resetar os valores do pagamento
    setPaymentMethod("");
    setPaymentAmount("");
  };


  const openPaymentModal = () => {
    if (cart.length === 0) {
      showMessage("Adicione itens ao carrinho antes de totalizar a compra", "error");
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

  const confirmCancelSale = () => {
    if (cart.length === 0) {
      showMessage("Adicione itens ao carrinho antes de cancelar a compra.", "error");
    } else {
      setCart([]); // Limpa o carrinho
      setTotalGeneral(0); // Reseta o total geral
      setRemainingTotal(0); // Reseta o valor restante
      setTotalPaid(0); // Reseta o total pago
      setChange(0); // Reseta o troco
      setPaymentHistory([]); // Limpa o histórico de pagamentos
      setPaymentMethod(""); // Reseta o método de pagamento
      setPaymentAmount(""); // Reseta o valor de pagamento atual
      showMessage("Venda cancelada com sucesso!", "success");
      closeConfirmCancelSaleModal();

      // 🔴 CORRIGIDO: Passando um objeto válido para setHighlightedProduct
      setHighlightedProduct({ nome: "Nenhum produto selecionado" });
    }
  };

  const resetSale = () => {
    setCart([]);
    setTotalGeneral(0);
    setRemainingTotal(0);
    setTotalPaid(0);
    setChange(0);
    setPaymentHistory([]);
    setPaymentMethod("");
    setPaymentAmount(0);
    setIsPaymentModalOpen(false);
    setHighlightedProduct({ nome: "Nenhum produto selecionado" });
  };

  const sendSaleToAPI = async () => {
    if (cart.length === 0) {
      showMessage("Erro: Nenhum item no carrinho para registrar venda.", "error");
      return;
    }

    if (remainingTotal > 0) {
      showMessage("Erro: O pagamento não está completo.", "error");
      return;
    }

    try {
      const saleData = {
        operador_id: operatorNumber,
        filial_id: operadorFilial,
        pedido: null, // 🔹 Defina corretamente a filial
        cliente: "Cliente Padrão",
        itens: cart.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantity,
          preco_unitario: item.preco_venda,
          desconto: item.discountApplied || 0,
        })),
        pagamentos: paymentHistory.map((p) => ({
          forma_pagamento_id: paymentMethods.find((pm) => pm.nome === p.method)?.id,
          valor: p.amount,
        })),
      };

      const response = await api.post("/vendas", saleData);

      if (response.status === 201) {
        showMessage("Venda finalizada e registrada com sucesso!", "success");
        resetSale(); // 🔹 Reseta o PDV após finalizar a venda
      } else {
        showMessage("Erro ao registrar venda.", "error");
      }
    } catch (error) {
      showMessage(`Erro ao enviar venda: ${error.message}`, "error");
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
                total: Number(item.total) + Number(product.preco_venda), // Converte para número e soma corretamente
              }
              : item
          );
        } else {
          updatedCart = [
            ...cart,
            {
              ...product,
              quantity: 1,
              total: Number(product.preco_venda), // Garante que seja um número
            },
          ];
        }

        setCart(updatedCart);

        // Atualiza o produto destacado IMEDIATAMENTE
        setHighlightedProduct({
          ...product,
          quantity: 1,
          total: Number(product.preco_venda),
        });

        // Atualiza o total geral
        setTotalGeneral(
          updatedCart.reduce((sum, item) => sum + Number(item.finalTotal || item.total), 0)
        );

        // Limpa campos de entrada
        setBarcode("");
        setQuantity(1);
      } else {
        showMessage("Produto não encontrado.", "error");
        setBarcode("");
      }
    }
  };


  const addToCart = () => {
    if (!highlightedProduct || !highlightedProduct.id) {
      showMessage("Selecione um produto antes de adicionar.", "error");
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

  const cancelPayment = () => {
    setTotalPaid(0); // Reseta o total pago
    setRemainingTotal(totalGeneral); // Reseta o total restante para o valor total da compra
    setChange(0); // Reseta o troco
    setPaymentHistory([]); // Limpa todo o histórico de pagamentos
    setPaymentMethod(""); // Reseta o método de pagamento selecionado
    setPaymentAmount(""); // Reseta o valor do pagamento
    setIsPaymentModalOpen(false); // Fecha o modal de pagamento

    showMessage("Todos os pagamentos foram cancelados.", "success");
  };



  return (
    <>

      {/* Modal para Confirmar Cancelamento da Venda */}
      {isConfirmCancelSaleOpen && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Confirmar Cancelamento da Venda</h2>
            <p>Tem certeza de que deseja cancelar toda a venda?</p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={confirmCancelSale}>Sim, Cancelar Venda</ConfirmButton>
              <ConfirmCancelButton onClick={closeConfirmCancelSaleModal}>Cancelar</ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}

      {/* Modal para Confirmar Cancelamento de Itens */}
      {isConfirmCancelItemOpen && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Confirmar Cancelamento de Itens</h2>
            <p>Tem certeza de que deseja remover os itens selecionados?</p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={confirmCancelItems}>Sim, Remover Itens</ConfirmButton>
              <ConfirmCancelButton onClick={closeConfirmCancelItemModal}>Cancelar</ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}

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
              <SettingsLabel>Impressão Automática de Recibo:</SettingsLabel>
              <SettingsCheckbox
                type="checkbox"
                checked={autoPrint}
                onChange={() => setAutoPrint(!autoPrint)}
              /> Ativar

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
            <IconButton
              title="Aplicar desconto no item"
              style={{ backgroundColor: "#2196F3", color: "white" }}
              onClick={() => setIsDiscountModalOpen(true)}
            >
              <FaTag />
            </IconButton>

            <IconButton
              title="Aplicar desconto no total"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              onClick={() => setIsTotalDiscountModalOpen(true)}
            >
              <FaTags />
            </IconButton>

            <IconButton
              title="Adicionar ao carrinho"
              style={{ backgroundColor: "#FF9800", color: "white" }}
              onClick={addToCart}
            >
              <FaShoppingCart />
            </IconButton>

            <IconButton
              title="Buscar produtos"
              style={{ backgroundColor: "#673AB7", color: "white" }}
              onClick={() => setIsProductModalOpen(true)}
            >
              <FaSearch />
            </IconButton>

            <IconButton
              title="Finalizar compra"
              style={{ backgroundColor: "#009688", color: "white" }}
              onClick={() => openPaymentModal()}
            >
              <FaMoneyBillWave />
            </IconButton>

            <IconButton
              title="Cancelar venda"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={openConfirmCancelSaleModal}
            >
              <FaTimes />
            </IconButton>

            <IconButton
              title="Cancelar itens selecionados"
              style={{
                backgroundColor: cart.length > 0 ? "#FFA500" : "red",
                color: "white",
                cursor: cart.length > 0 ? "pointer" : "not-allowed"
              }}
              disabled={cart.length === 0}
              onClick={() => setIsCancelItemModalOpen(true)}
            >
              <FaUndo />
            </IconButton>
          </IconButtonGroup>


        </LeftSection>
        <RightSection>
          <TotalContainer>
            <TotalDisplay>
              Total Geral: R$ {(Number(totalGeneral) || 0).toFixed(2)}
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
                    <td>R$ {product.total}</td>
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
                <SettingsSelect onChange={(e) => setSelectedItem(e.target.value)}>
                  <option value="">Escolha um produto</option>
                  {cart.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </SettingsSelect>
              </InputGroup>
              <InputGroup>
                <label>Tipo de Desconto:</label>
                <SettingsSelect onChange={(e) => setDiscountType(e.target.value)}>
                  <option value="percentage">Porcentagem</option>
                  <option value="value">Valor Fixo</option>
                </SettingsSelect>
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
                <SettingsSelect onChange={(e) => setDiscountType(e.target.value)}>
                  <option value="percentage">Porcentagem</option>
                  <option value="value">Valor Fixo</option>
                </SettingsSelect>
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
                          R$ {product.total}
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
                onClick={openConfirmCancelItemModal}
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

        {isPaymentModalOpen && (
          <ModalOverlay >

          <PaymentModalContainer>
            <CloseButton onClick={() => setIsPaymentModalOpen(false)}>×</CloseButton>

            <ModalTitle>💳 Finalizar Pagamento</ModalTitle>

            {/* Exibição do Total */}
            <TotalContainer>
              <TotalDisplay>
                Total Geral: <span>R$ {(Number(totalGeneral) || 0).toFixed(2)}</span>
              </TotalDisplay>
            </TotalContainer>

            {/* Detalhes do Pagamento */}
            <p><strong>💰 Total Restante:</strong> R$ {(Number(remainingTotal) || 0).toFixed(2)}</p>
            <p><strong>✅ Total Pago:</strong> R$ {totalPaid.toFixed(2)}</p>
            {change > 0 && <p><strong>🔄 Troco:</strong> R$ {change.toFixed(2)}</p>}

            {/* Escolha do Método de Pagamento */}
            <div>
              <label>Método de Pagamento:</label>
              <PaymentSelect
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Selecione</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.nome}>
                    {method.nome}
                  </option>
                ))}
              </PaymentSelect>
            </div>

            {/* Input de Valor do Pagamento */}
            <div style={{ marginTop: "10px" }}>
              <label>💵 Valor do Pagamento:</label>
              <PaymentInput
                type="number"
                value={paymentAmount === "" ? "" : paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value ? Number(e.target.value) : "")}
              />
            </div>

            {/* Botões de Ação */}
            <ButtonGroup>
              <ActionButton variant="confirm" onClick={handlePartialPayment}>
                <FaCheckCircle size={16} /> Confirmar Pagamento
              </ActionButton>

              <ActionButton variant="finalize" onClick={sendSaleToAPI} disabled={remainingTotal > 0}>
                <FaMoneyBillWave size={16} /> Finalizar Compra
              </ActionButton>

              <ActionButton variant="cancel" onClick={cancelPayment}>
                <FaTimes size={16} /> Cancelar Pagamento
              </ActionButton>
            </ButtonGroup>

            {/* Histórico de Pagamentos */}
            {paymentHistory.length > 0 && (
              <PaymentHistoryContainer>
                <PaymentHistoryText>📜 Pagamentos Realizados:</PaymentHistoryText>
                <PaymentHistoryList>
                  {paymentHistory.map((payment, index) => (
                    <li key={index}>
                      {payment.method}: <strong>R$ {payment.amount.toFixed(2)}</strong>
                    </li>
                  ))}
                </PaymentHistoryList>
              </PaymentHistoryContainer>
            )}
          </PaymentModalContainer>
          </ModalOverlay>
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
