import React, { useState, useEffect } from "react";
import {
  Container,
  HighlightedProduct,
  Button,
  ProductModal,
  ProductModalContent,
  ProductCard,
  IconButton,
  IconButtonGroup,
  ModalOverlay,
  SettingsModal,
  SettingsIcon,
  SettingsSelect,
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
  ButtonGroup,
  ProductImage,
  ProductImageContainer,
  SectionTitle,
} from "./styles";

import {
  FaShoppingCart,
  FaSearch,
  FaMoneyBillWave,
  FaTimes,
  FaUndo,
  FaTag,
  FaTags,
  FaCog,
  FaCheckCircle,
  FaExclamationCircle,
  FaPrint,
  FaDownload
} from "react-icons/fa";

import {
  CategorySection,
  ProductGrid,
  DivDesc
} from "./styles";

import api from "../../../api";

import {
  ConfirmModalContainer,
  ConfirmCancelButton,
  ConfirmButton,
  ConfirmModalContent,
  ConfirmButtonContainer,
  RightSection,
  LeftSection,
  InputGroup,
  ContentWrapper,
  ReceiptContainer,
  FixedFooter,
  TotalContainer,
  TotalDisplay,
  OperatorInfo,
  ReceiptItem,
  CloseButton,
  IconButtonHeader,
  ModalPedidosContent,
  ListaPedidosScrollable,
  TitlePedidos,
  ListaPedidosGrid,
  PedidoCard,
  ModalButtons
} from '../../../styles/utils';


import { useNavigate } from "react-router-dom";
import { HeaderCart } from "../Pedidos/styles";

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

  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [searchSale, setSearchSale] = useState("");
  const [sales, setSales] = useState([]);
  const [selectedReceipts, setSelectedReceipts] = useState([]);

  const [startDate, setStartDate] = useState(""); // Data inicial
  const [endDate, setEndDate] = useState(""); // Data final

  // Estado para abrir o modal de confirmação
  const [isConfirmPrintModalOpen, setIsConfirmPrintModalOpen] = useState(false);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [importedOrderId, setImportedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const filteredOrders = pendingOrders.filter((pedido) =>
    pedido.id.toString().includes(searchTerm) ||
    (pedido.cliente && pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (isOrderModalOpen) {
      api.get("/pedidos_pendentes")
        .then((res) => setPendingOrders(res.data)) // ✅ Usa res.data diretamente
        .catch((error) => console.error("Erro ao buscar pedidos:", error));
    }
  }, [isOrderModalOpen]);


  const importOrder = (pedido) => {
    if (!pedido || !pedido.itens || pedido.itens.length === 0) {
      showMessage("O pedido não contém itens válidos.", "error");
      return;
    }

    const updatedCart = pedido.itens.map((item) => ({
      id: item.produto_id,
      nome: item.produto_nome,
      quantidade: Number(item.quantidade),
      preco_venda: parseFloat(item.preco_unitario),
      total: Number(item.quantidade) * parseFloat(item.preco_unitario),
    }));

    setCart(updatedCart);
    setTotalGeneral(updatedCart.reduce((sum, item) => sum + item.total, 0));
    setRemainingTotal(updatedCart.reduce((sum, item) => sum + item.total, 0) - totalPaid);

    setHighlightedProduct(updatedCart[0] || { nome: "Nenhum produto selecionado" });

    setImportedOrderId(pedido.id); // Salva o ID do pedido importado

    setIsOrderModalOpen(false);


    setHighlightedProduct({ nome: "Nenhum produto selecionado" })
  };

  useEffect(() => {
    setRemainingTotal(totalGeneral - totalPaid);
  }, [totalGeneral, totalPaid]);

  const navigate = useNavigate()

  // 🔹 Fecha o modal sem sair
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmModal = () => {
    localStorage.removeItem("tokenPdv")
    setIsConfirmModalOpen(true)
  }

  const confirmBackToHome = () => {
    navigate("/home"); // 🔹 Redireciona para Home
  };

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

  // Abre o modal de confirmação antes de finalizar a compra
  const handleConfirmPrint = () => {
    setIsConfirmPrintModalOpen(true);
  };

  // Chama a API após o usuário decidir imprimir ou não
  const handleFinalizeSale = (print) => {
    setShouldPrint(print);
    setIsConfirmPrintModalOpen(false);
    sendSaleToAPI(print);
  };

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

  const handlePartialPayment = () => {
    if (!paymentMethod || paymentAmount <= 0) {
      showMessage("Erro: Escolha um método de pagamento e insira um valor válido.", "error");
      return;
    }

    const newTotalPaid = totalPaid + paymentAmount;
    const newRemainingTotal = Math.max(0, remainingTotal - paymentAmount);
    let changeAmount = 0; // Inicializa o troco

    if (paymentAmount > remainingTotal) {
      changeAmount = parseFloat((paymentAmount - remainingTotal).toFixed(2)); // Calcula o troco apenas no último pagamento
    }

    const newPayment = {
      method: paymentMethod,
      amount: parseFloat(paymentAmount.toFixed(2)), // Garantia de precisão
      change: changeAmount, // Troco apenas para o último pagamento
    };

    setPaymentHistory([...paymentHistory, newPayment]);

    setTotalPaid(newTotalPaid);
    setRemainingTotal(newRemainingTotal);
    setChange(changeAmount); // Atualiza o troco global

    setPaymentAmount(""); // Reseta o input
    setPaymentMethod(""); // Reseta o método de pagamento
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

  const sendSaleToAPI = async (shouldPrint) => {
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
        pedido: importedOrderId || null, // Envia o ID do pedido, caso tenha sido importado
        cliente: "Cliente Padrão",
        itens: cart.map((item) => ({
          produto_id: item.id,
          quantidade: Number(item.quantidade),
          preco_unitario: parseFloat(item.preco_venda),
          desconto: parseFloat(item.discountApplied || 0),
        })),
        pagamentos: paymentHistory.map((p, index) => {
          const paymentMethod = paymentMethods.find((pm) => pm.nome === p.method);
          const isLastPayment = index === paymentHistory.length - 1;

          return {
            forma_pagamento_id: paymentMethod ? paymentMethod.id : null,
            valor_pago: parseFloat(p.amount),
            troco: isLastPayment ? parseFloat(p.change) : 0,
          };
        }),
        imprimir_cupom: shouldPrint,
      };

      console.log("📌 Dados enviados para API:", saleData);

      const response = await api.post("/vendas", saleData);

      if (response.status === 201) {
        showMessage("Venda finalizada e registrada com sucesso!", "success");

        if (shouldPrint) {
          const pdfBase64 = response.data.cupom_fiscal_pdf;
          if (pdfBase64) {
            downloadPDF(pdfBase64, `CupomFiscal_${response.data.venda_id}.pdf`);
          }
        }

        resetSale();
      } else {
        showMessage("Erro ao registrar venda.", "error");
      }
    } catch (error) {
      console.error("❌ Erro ao enviar venda:", error);
      showMessage(`Erro ao enviar venda: ${error.message}`, "error");
    }
  };

  const fetchSalesForPrinting = async () => {
    if (!startDate || !endDate) {
      showMessage("Selecione um período antes de buscar cupons.", "warning");
      return;
    }

    try {
      const response = await api.get(`/vendas?start_date=${startDate}&end_date=${endDate}`);
      if (response.status === 200) {
        if (response.data.length === 0) {
          showMessage("Nenhum cupom encontrado nesse período.", "warning");
        }
        setSales(response.data);
      } else {
        showMessage("Erro ao buscar cupons.", "error");
      }
    } catch (error) {
      showMessage(`Erro ao buscar cupons: ${error.message}`, "error");
    }
  };

  const toggleSelectReceipt = (id) => {
    setSelectedReceipts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const confirmReprint = async () => {
    if (selectedReceipts.length === 0) {
      showMessage("Nenhum cupom selecionado.", "warning");
      return;
    }

    for (let receiptId of selectedReceipts) {
      try {
        const response = await api.post(`/reimprimir_venda`, { venda_id: receiptId }); // Enviando no corpo da requisição
        if (response.status === 200) {
          downloadPDF(response.data.cupom_fiscal_pdf, `CupomFiscal_${receiptId}.pdf`);
        } else {
          showMessage(`Erro ao reimprimir cupom ${receiptId}.`, "error");
        }
      } catch (error) {
        showMessage(`Erro ao reimprimir cupom ${receiptId}: ${error.message}`, "error");
      }
    }

    showMessage("Cupons reimpressos com sucesso!", "success");
    setIsReprintModalOpen(false);
  };


  const openReprintModal = () => {
    setIsReprintModalOpen(true); // 🔹 Agora abre primeiro e depois busca os cupons quando o usuário solicitar
  };

  // 🔹 Função para converter Base64 em Blob e fazer download do PDF
  const downloadPDF = (base64Data, filename) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Criar um link temporário e baixar o arquivo
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleBarcodeEnter = (e) => {
    if (e.key === "Enter") {
      const product = products.find((p) => p.codigo_barras === barcode);

      if (product) {
        const existingProduct = cart.find((item) => item.id === product.id);
        const quantidadeSelecionada = quantity > 0 ? quantity : 1; // Respeita a quantidade digitada

        let updatedCart;
        if (existingProduct) {
          updatedCart = cart.map((item) =>
            item.id === product.id
              ? {
                ...item,
                quantity: item.quantity + quantidadeSelecionada, // Usa a quantidade digitada
                total: Number(item.total) + Number(product.preco_venda) * quantidadeSelecionada, // Recalcula o total
              }
              : item
          );
        } else {
          updatedCart = [
            ...cart,
            {
              ...product,
              quantity: quantidadeSelecionada,
              total: Number(product.preco_venda) * quantidadeSelecionada, // Ajusta o total conforme a quantidade
            },
          ];
        }

        setCart(updatedCart);

        // Atualiza o produto destacado IMEDIATAMENTE
        setHighlightedProduct({
          ...product,
          quantity: quantidadeSelecionada,
          total: Number(product.preco_venda) * quantidadeSelecionada,
        });

        // Atualiza o total geral
        setTotalGeneral(
          updatedCart.reduce((sum, item) => sum + Number(item.finalTotal || item.total), 0)
        );

        // Limpa campos de entrada
        setBarcode("");
        setQuantity(0); // Mantém 1 para evitar comportamento estranho
      } else {
        showMessage("Produto não encontrado.", "error");
        setBarcode("");
      }
    }
  };


  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1, 
              total: Number(item.total) + Number(item.preco_venda), // Certifica que total é numérico
            }
          : item
      )
    );
  };


  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1, // Diminui a quantidade
              total: Number(item.total) - Number(item.preco_venda), // Atualiza o total corretamente
            }
          : item
      )
    );
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

    // **Zera o produto selecionado para obrigar a escolha de um novo produto**
    setHighlightedProduct({ nome: "Nenhum produto selecionado" });

    // **Zera os campos de entrada**
    setBarcode("");
    setQuantity(0);
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
      <Container>
        <DivDesc>
          {highlightedProduct && (
            <HighlightedProduct>
              <h3>{highlightedProduct.nome}</h3>
            </HighlightedProduct>
          )}
        </DivDesc>

        <ContentWrapper>
          <LeftSection>
            <ProductImageContainer>
              <ProductImage
                src={highlightedProduct?.imagem ? `data:image/jpeg;base64,${highlightedProduct.imagem}` : "https://via.placeholder.com/150px"}
                alt={highlightedProduct?.nome || "Produto"}
              />
            </ProductImageContainer>


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
              <IconButton title="Aplicar desconto no item" onClick={() => setIsDiscountModalOpen(true)}>
                <FaTag />
              </IconButton>

              <IconButton title="Aplicar desconto no total" onClick={() => setIsTotalDiscountModalOpen(true)}>
                <FaTags />
              </IconButton>

              <IconButton title="Adicionar ao carrinho" onClick={addToCart}>
                <FaShoppingCart />
              </IconButton>

              <IconButton title="Buscar produtos" onClick={() => setIsProductModalOpen(true)}>
                <FaSearch />
              </IconButton>

              <IconButton title="Finalizar compra" onClick={() => openPaymentModal()}>
                <FaMoneyBillWave />
              </IconButton>

              <IconButton title="Cancelar venda" onClick={openConfirmCancelSaleModal}>
                <FaTimes />
              </IconButton>

              <IconButton title="Cancelar itens selecionados" disabled={cart.length === 0} onClick={() => setIsCancelItemModalOpen(true)}>
                <FaUndo />
              </IconButton>

              <IconButton title="Reimprimir Cupom" onClick={openReprintModal}>
                <FaPrint />
              </IconButton>
              <IconButton title="Importar Pedido" onClick={() => setIsOrderModalOpen(true)}>
                <FaDownload />
              </IconButton>

            </IconButtonGroup>
          </LeftSection>

          <RightSection>
            <SectionTitle>🛒 Itens Adicionados</SectionTitle>
            <ReceiptContainer>
              <HeaderCart>
              <span>Nome </span>
              <span>Codigo de Barras</span>
              <span>Preço</span>
              <span>Quantidade</span>
              <span>Acões</span>
              </HeaderCart>
              {cart.map((product) => (
                <ReceiptItem key={product.id}>
                  <div className="info">
                    <span className="nome">{product.nome}</span>
                    <span className="codigo-barras">{product.codigo_barras}</span>
                    <span className="preco">R$ {(Number(product.total) || 0).toFixed(2)}</span>
                    <span className="preco">{product.quantity}</span>
                  </div>
                  <IconButtonHeader onClick={() => increaseQuantity(product.id)}>➕</IconButtonHeader>
                  <IconButtonHeader onClick={() => decreaseQuantity(product.id)}>➖</IconButtonHeader>
                  <IconButtonHeader onClick={() => setCart(cart.filter((p) => p.id !== product.id))}>
                      ❌
                    </IconButtonHeader>
                </ReceiptItem>
              ))}
            </ReceiptContainer>

            <FixedFooter>
              <TotalContainer>
                <TotalDisplay>
                  Total Geral: R$ {(Number(totalGeneral) || 0).toFixed(2)}
                </TotalDisplay>
              </TotalContainer>
            </FixedFooter>

          </RightSection>

        </ContentWrapper>
        <OperatorInfo>
          Operador: {operatorNumber} - {operatorName} | Data:{" "}
          {currentTime.toLocaleDateString()} | Hora:{" "}
          {currentTime.toLocaleTimeString()}
        </OperatorInfo>

        {isConfirmPrintModalOpen && (
          <ConfirmModalContainer>
            <ConfirmModalContent>
              <h2>Deseja imprimir o comprovante?</h2>
              <p>Selecione se deseja gerar e imprimir o cupom fiscal.</p>
              <ConfirmButtonContainer>
                <ConfirmButton onClick={() => handleFinalizeSale(true)}>Sim, imprimir</ConfirmButton>
                <ConfirmCancelButton onClick={() => handleFinalizeSale(false)}>Não, apenas finalizar</ConfirmCancelButton>
              </ConfirmButtonContainer>
            </ConfirmModalContent>
          </ConfirmModalContainer>
        )}

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


        <SettingsIcon onClick={() => setIsSettingsModalOpen(true)}>
          <FaCog />
        </SettingsIcon>

        {/* Modal de Configuração */}
        {isSettingsModalOpen && (
          <ModalOverlay>
            <SettingsModal>
              <h2>Configurações do PDV</h2>
              <SettingsButton onClick={() => handleConfirmModal()}>
                Home
              </SettingsButton>
              <SettingsButton onClick={() => setIsSettingsModalOpen(false)}>
                Voltar
              </SettingsButton>
            </SettingsModal>
          </ModalOverlay>
        )}

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
                              imagem: product.imagem,
                              quantity: 1,
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

        {isReprintModalOpen && (
          <ProductModal>
            <ProductModalContent>
              <CloseButton onClick={() => setIsReprintModalOpen(false)}>X</CloseButton>
              <h2>Reimprimir Cupons</h2>

              {/* Campos para Seleção de Data */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ flex: 1, padding: "8px", borderRadius: "8px" }}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ flex: 1, padding: "8px", borderRadius: "8px" }}
                />
                <Button onClick={fetchSalesForPrinting} style={{ backgroundColor: "#28A745", color: "white" }}>
                  Buscar
                </Button>
              </div>

              {/* Campo de Pesquisa */}
              <input
                type="text"
                placeholder="Pesquisar por cliente ou ID"
                value={searchSale}
                onChange={(e) => setSearchSale(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />

              {/* Lista de Cupons para Seleção */}
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                {sales.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999" }}>Nenhum cupom encontrado.</p>
                ) : (
                  sales
                    .filter((sale) =>
                      sale.cliente.toLowerCase().includes(searchSale.toLowerCase()) ||
                      sale.venda_id.toString().includes(searchSale)
                    )
                    .map((sale) => (
                      <div
                        key={sale.venda_id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {/* Informações da Venda */}
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: "bold" }}>
                            ID: {sale.venda_id} - {sale.cliente}
                          </p>
                          <p style={{ margin: "5px 0", color: "#555" }}>
                            R$ {sale.total_venda} - {sale.data_venda}
                          </p>
                        </div>

                        {/* Checkbox para Selecionar Venda */}
                        <input
                          type="checkbox"
                          checked={selectedReceipts.includes(sale.venda_id)}
                          onChange={() => toggleSelectReceipt(sale.venda_id)}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </div>
                    ))
                )}
              </div>

              {/* Botão de Reimpressão */}
              <Button
                onClick={confirmReprint}
                style={{
                  marginTop: "20px",
                  backgroundColor: "#007BFF",
                  color: "white",
                }}
              >
                Reimprimir Selecionados
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

                <ActionButton variant="finalize" onClick={handleConfirmPrint} disabled={remainingTotal > 0}>
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

        {/* 🔹 Modal de Confirmação */}
        {isConfirmModalOpen && (
          <ConfirmModalContainer>
            <ConfirmModalContent>
              <h2>Confirmar saída do PDV</h2>
              <p>Tem certeza de que deseja voltar para a Home?</p>
              <ConfirmButtonContainer>
                <ConfirmButton onClick={confirmBackToHome}>Sim, Voltar</ConfirmButton>
                <ConfirmCancelButton onClick={closeConfirmModal}>Cancelar</ConfirmCancelButton>
              </ConfirmButtonContainer>
            </ConfirmModalContent>
          </ConfirmModalContainer>
        )}
        {isOrderModalOpen && (
          <ModalOverlay onClose={() => setIsOrderModalOpen(false)}>
            <ModalPedidosContent>
              <CloseButton onClick={() => setIsOrderModalOpen(false)}>×</CloseButton>
              <TitlePedidos>📋 Pedidos Pendentes</TitlePedidos>

              {/* 🔹 Campo de Pesquisa */}
              <InputGroup>
                <input
                  type="text"
                  placeholder="🔎 Buscar por ID ou Cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {filteredOrders.length === 0 ? (
                <p>Nenhum pedido encontrado.</p>
              ) : (
                <ListaPedidosScrollable>
                  <ListaPedidosGrid>
                    {filteredOrders.map((pedido) => (
                      <PedidoCard key={pedido.id} status={pedido.status}>
                        <p className="pedido-id">Pedido #{pedido.id}</p>
                        <p><strong>Cliente:</strong> {pedido.cliente || "Não identificado"}</p>
                        <p className="pedido-total"><strong>Total:</strong> R$ {pedido.total || "0.00"}</p>
                        <p><strong>Taxa de Entrega:</strong> R$ {pedido.taxa_entrega || "0.00"}</p>
                        <p className="pedido-status"><strong>Status:</strong> {pedido.status === "P" ? "Pendente" : "Finalizado"}</p>

                        {/* 🔹 Botão de Importação */}
                        <ModalButtons>
                          <IconButtonHeader onClick={() => importOrder(pedido)}>
                            ✅ Importar Pedido
                          </IconButtonHeader>
                        </ModalButtons>
                      </PedidoCard>
                    ))}
                  </ListaPedidosGrid>
                </ListaPedidosScrollable>
              )}
            </ModalPedidosContent>
          </ModalOverlay>
        )}


      </Container>
    </>
  );
};

export default PDV;
