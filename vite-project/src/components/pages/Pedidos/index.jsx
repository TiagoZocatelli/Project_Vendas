import { useEffect, useState } from "react";
import { FaCheck, FaSearch, FaPlus, FaTimes, FaList } from "react-icons/fa";
import {
    IconButton, Container, SectionTitle, ScrollableTableContainer, SearchContainer,
    SearchInput, CategoryContainer, ProductsGrid, ProductCard, ModalOverlay, ModalContent,
    CloseButton, ModalActions, ObservacaoInput, TaxaInput, ProductTableWrapper,
    ModalProductCard,
    SearchInputModal,
    CategoryFilterContainer,
    ModalPedidoContent,
    TitlePedido,
    PedidoInfo,
    InputTaxa,
    ObservacaoContainer,
    FilialSelectContainer,
    FilialSelect,
    QuantityModalContent,
    QuantityInput,
} from "./styles";

import {
    HeaderContainer,
    Title,
    ButtonContainer,
    IconButtonHeader,
    RightSection,
    LeftSection,
    ContentWrapper,
    ReceiptContainer,
    FixedFooter,
    TotalContainer,
    TotalDisplay,
    ModalButtons,
    OperatorInfo,
    ModalPedidosContent,
    ListaPedidosScrollable,
    TitlePedidos,
    ListaPedidosGrid,
    PedidoCard,
    ReceiptItem,
    InputGroup,
    ConfirmButton
} from '../../../styles/utils'

import api from "../../../api";

const Pedidos = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermPedidos, setSearchTermPedidos] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pedido, setPedido] = useState([]);
    const [observacao, setObservacao] = useState("");
    const [ClienteNome, setClienteNome] = useState("")
    const [taxaAdicional, setTaxaAdicional] = useState("");
    const [descontoTotal, setDescontoTotal] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListaPedidosOpen, setIsListaPedidosOpen] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchProductTerm, setSearchProductTerm] = useState("");
    const [selectedModalCategory, setSelectedModalCategory] = useState("");
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState(""); // 🔹 Estado para mensagem de sucesso
    const [subtotal, setSubtotal] = useState(0);
    const [totalPedido, setTotalPedido] = useState(0);
    const [filiais, setFiliais] = useState([]); // Estado para armazenar as filiais
    const [filialSelecionada, setFilialSelecionada] = useState(""); // Estado para a filial selecionada
    const [currentTime, setCurrentTime] = useState(new Date());

    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null); // 

    const [isQuantityModalOpenEdit, setIsQuantityModalOpenEdit] = useState(false);
    const [selectedProductEdit, setSelectedProductEdit] = useState(null);
    const [quantityEdit, setQuantityEdit] = useState();


    const openQuantityModalEdit = (product) => {
        setSelectedProductEdit(product);
        setIsQuantityModalOpenEdit(true);
        setQuantityEdit(0)
    };

    // 🔹 Confirma a quantidade e adiciona ao pedido
    const confirmAddProductEdit = () => {
        if (!selectedProductEdit) return;

        adicionarProdutoAoPedido(selectedProductEdit, quantityEdit);
        setIsQuantityModalOpenEdit(false);
    };


    // 🔹 Abre o modal para definir a quantidade
    const openQuantityModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsQuantityModalOpen(true);
    };

    // 🔹 Confirma a quantidade e adiciona ao pedido
    const confirmAddProduct = () => {
        if (!selectedProduct) {
            console.error("Erro: Nenhum produto selecionado!");
            return;
        }

        // Converte a quantidade para número e adiciona ao pedido
        addToPedido({ ...selectedProduct, quantity: parseFloat(quantity) });
        setIsQuantityModalOpen(false);
    };


    // 🔹 Adiciona o produto ao pedido
    const addToPedido = (product) => {
        setPedido((prevPedido) => {
            const existingProduct = prevPedido.find((item) => item.id === product.id);

            if (existingProduct) {
                return prevPedido.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity } // 🔹 Soma quantidades corretamente
                        : item
                );
            } else {
                return [...prevPedido, { ...product, quantity: product.quantity }];
            }
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const filteredPedidos = pedidos.filter((pedido) =>
        pedido.id.toString().includes(searchTermPedidos) ||
        (pedido.cliente && pedido.cliente.toLowerCase().includes(searchTermPedidos.toLowerCase()))
    );

    const openAddProductModal = () => setIsAddProductModalOpen(true);
    const closeAddProductModal = () => setIsAddProductModalOpen(false);

    const User = localStorage.getItem("userName")
    const UserFilial = localStorage.getItem("filial_id_user")

    const filteredModalProducts = products.filter(
        (product) =>
            product.nome.toLowerCase().includes(searchProductTerm.toLowerCase()) &&
            (selectedModalCategory === "" || product.categoria_nome === selectedModalCategory)
    );

    useEffect(() => {
        carregarFiliais()
        carregarProdutos();
        carregarPedidos();
    }, []);

    const carregarFiliais = () => {
        if (!UserFilial) {
            console.error("Erro: UserFilial não está definido!");
            return;
        }

        const url = `/filiais?filial_id=${UserFilial}`; // Filtra pela filial do usuário

        api.get(url)
            .then((res) => {
                setFiliais(res.data);

                if (res.data.length > 0) {
                    setFilialSelecionada(res.data[0].id); // Seleciona a primeira filial retornada
                }
            })
            .catch((error) => console.error("Erro ao carregar Filiais:", error));
    };


    const carregarProdutos = () => {
        api.get("/produtos")
            .then((res) => {
                setProducts(res.data);
                const categoriasUnicas = [...new Set(res.data.map((prod) => prod.categoria_nome))];
                setCategories(categoriasUnicas);
            })
            .catch((error) => console.error("Erro ao carregar produtos:", error));
    };

    const carregarPedidos = () => {
        api.get("/pedidos_pendentes")
            .then((res) => setPedidos(res.data))
            .catch((error) => console.error("Erro ao carregar pedidos:", error));
    };

    const editarQuantidade = (produtoId, novaQuantidade) => {
        const quantidadeConvertida = parseFloat(novaQuantidade);

        if (isNaN(quantidadeConvertida) || quantidadeConvertida <= 0) {
            alert("Quantidade inválida! Insira um valor maior que 0.");
            return;
        }

        setPedidoSelecionado((prevPedido) => {
            const itensAtualizados = prevPedido.itens.map((item) =>
                item.produto_id === produtoId
                    ? { ...item, quantidade: quantidadeConvertida } // ✅ Agora permite frações
                    : item
            );
            return { ...prevPedido, itens: itensAtualizados };
        });
    };


    const removerItem = (produtoId) => {
        setPedidoSelecionado((prevPedido) => {
            const itensFiltrados = prevPedido.itens.filter((item) => item.produto_id !== produtoId);
            return { ...prevPedido, itens: itensFiltrados };
        });
    };


    const openListaPedidos = () => setIsListaPedidosOpen(true);
    const closeListaPedidos = () => setIsListaPedidosOpen(false);

    const openPedidoDetalhes = (pedido) => setPedidoSelecionado(pedido);
    const closePedidoDetalhes = () => setPedidoSelecionado(null);

    const excluirPedido = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;

        if (!filialSelecionada) {
            alert("Selecione uma filial antes de excluir o pedido.");
            return;
        }

        try {
            await api.delete(`/pedidos/${id}`, {
                data: { filial_id: filialSelecionada }, // 🔹 Passando a filial na requisição
            });

            alert("Pedido excluído com sucesso!");

            // Remove o pedido da lista sem precisar recarregar a página
            setPedidos((prevPedidos) => prevPedidos.filter(p => p.id !== id));

        } catch (error) {
            console.error("Erro ao excluir pedido:", error);
            alert("Erro ao excluir pedido!");
        }
    };


    const filteredProducts = products.filter(
        (product) =>
            product.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "" || product.categoria_nome === selectedCategory)
    );

    const increaseQuantity = (id) => {
        setPedido((prevPedido) =>
            prevPedido.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setPedido((prevPedido) =>
            prevPedido
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromPedido = (id) => {
        setPedido((prevPedido) => prevPedido.filter((item) => item.id !== id));
    };


    useEffect(() => {
        // Calcula o subtotal somando os produtos sem desconto
        const subtotalCalculado = pedido.reduce((total, item) => total + item.preco_venda * item.quantity, 0);

        // Soma os descontos aplicados individualmente nos itens
        const totalDescontoItens = pedido.reduce((total, item) => total + (item.desconto || 0), 0);

        // Calcula o total final considerando os descontos e a taxa adicional
        const totalFinal = subtotalCalculado - totalDescontoItens - descontoTotal + parseFloat(taxaAdicional || 0);

        // Atualiza os estados
        setSubtotal(subtotalCalculado);
        setTotalPedido(totalFinal > 0 ? totalFinal : 0);
    }, [pedido, descontoTotal, taxaAdicional]);


    const openModal = () => {
        if (pedido.length === 0) {
            alert("Nenhum item no pedido!");
            return;
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const adicionarProdutoAoPedido = (produto, quantidade) => {
        const quantidadeFloat = parseFloat(quantidade);

        // 🔹 Validação: Impede que um produto seja adicionado com quantidade menor que 0.1
        if (!quantidade || isNaN(quantidadeFloat) || quantidadeFloat < 0.1) {
            alert("Erro: A quantidade mínima permitida para um item é 0.1.");
            return;
        }

        setPedidoSelecionado((prevPedido) => {
            const produtoExistente = prevPedido.itens.find((item) => item.produto_id === produto.id);

            let novoPedido;
            if (produtoExistente) {
                novoPedido = {
                    ...prevPedido,
                    itens: prevPedido.itens.map((item) =>
                        item.produto_id === produto.id
                            ? {
                                ...item,
                                quantidade: parseFloat(item.quantidade) + quantidadeFloat, // ✅ Garante valores decimais corretos
                            }
                            : item
                    ),
                };
            } else {
                novoPedido = {
                    ...prevPedido,
                    itens: [
                        ...prevPedido.itens,
                        {
                            produto_id: produto.id,
                            produto_nome: produto.nome,
                            quantidade: quantidadeFloat, // ✅ Permite valores decimais
                            preco_unitario: parseFloat(produto.preco_venda), // ✅ Garante conversão correta
                        },
                    ],
                };
            }

            return novoPedido;
        });

        setMensagemSucesso(`✅ ${quantidade} de ${produto.nome} foi adicionado ao pedido!`);
        setTimeout(() => setMensagemSucesso(""), 2000);
    };



    const salvarAlteracoesPedido = async () => {
        if (!pedidoSelecionado) return;

        const pedidoAtualizado = {
            filial_id: filialSelecionada, // ✅ Garante que a filial seja enviada
            cliente: pedidoSelecionado.cliente,
            total: parseFloat(
                pedidoSelecionado.itens.reduce(
                    (total, item) => total + parseFloat(item.preco_unitario) * parseFloat(item.quantidade),
                    0
                ).toFixed(2)
            ),
            taxa_entrega: parseFloat(pedidoSelecionado.taxa_entrega),
            observacao: pedidoSelecionado.observacao,
            itens: pedidoSelecionado.itens.map((item) => ({
                produto_id: item.produto_id,
                quantidade: parseFloat(item.quantidade),
                preco_unitario: parseFloat(item.preco_unitario),
                filial_id: filialSelecionada, // ✅ Agora, cada item tem a filial associada
            })),
        };

        try {
            const response = await api.put(`/pedidos/${pedidoSelecionado.id}`, pedidoAtualizado);

            if (response.status === 200) {
                alert("Pedido atualizado com sucesso!");
                carregarPedidos();
                setPedidoSelecionado(null);
            } else {
                alert(`Erro ao atualizar pedido: ${response.data?.error || "Erro desconhecido"}`);
            }
        } catch (error) {
            alert("Erro ao conectar com a API");
            console.error("Erro ao atualizar pedido:", error);
        }
    };


    const finalizarPedido = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        const pedidoData = {
            filial_id: filialSelecionada,
            cliente: ClienteNome, // Pode ser modificado para pegar do usuário
            total: totalPedido,
            taxa_entrega: parseFloat(taxaAdicional || 0),
            observacao: observacao,
            itens: pedido.map((item) => ({
                produto_id: item.id,
                quantidade: item.quantity,
                preco_unitario: item.preco_venda,
                total: item.preco_venda * item.quantity
            }))
        };

        try {
            const response = await api.post("/pedidos", pedidoData);

            console.log("Resposta da API:", response); // 🔹 Log da resposta completa

            if (response.status >= 200 && response.status < 300) {
                alert(`Pedido criado com sucesso! ID: ${response.data?.id || "ID não disponível"}`);
                setPedido([]);
                setObservacao("");
                setTaxaAdicional(0);
                setIsModalOpen(false);
                carregarPedidos()
            } else {
                console.error("Erro no response:", response); // 🔹 Log detalhado do erro
                alert(`Erro ao criar pedido: ${response.data?.error || "Erro desconhecido"}`);
            }
        } catch (error) {
            console.error("Erro ao conectar com a API:", error.response || error); // 🔹 Log do erro detalhado

            alert(
                `Erro ao conectar com a API: ${error.response?.data?.error || error.message || "Erro desconhecido"
                }`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Container>
                <HeaderContainer>
                    <Title>Pedidos</Title>

                    {/* 🔹 Seletor de Filial */}
                    <FilialSelectContainer>
                        <span>Filial:</span>
                        <FilialSelect
                            value={filialSelecionada}
                            onChange={(e) => setFilialSelecionada(e.target.value)}
                        >
                            {filiais.map((filial) => (
                                <option key={filial.id} value={filial.id}>
                                    {filial.nome}
                                </option>
                            ))}
                        </FilialSelect>
                    </FilialSelectContainer>

                    <ButtonContainer>
                        <IconButtonHeader onClick={openListaPedidos}>
                            <FaList />
                            <span>Lista de Pedidos</span>
                        </IconButtonHeader>
                        <IconButtonHeader onClick={openModal}>
                            <FaCheck />
                            <span>Finalizar</span>
                        </IconButtonHeader>
                    </ButtonContainer>
                </HeaderContainer>

                <ContentWrapper>
                    <LeftSection>
                        <SearchContainer>
                            <FaSearch size={16} />
                            <SearchInput
                                type="text"
                                placeholder="Pesquisar produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchContainer>

                        <CategoryContainer>
                            {categories.map((category) => (
                                <IconButtonHeader
                                    key={category}
                                    className={selectedCategory === category ? "active" : ""}
                                    onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                                >
                                    {category}
                                </IconButtonHeader>
                            ))}
                        </CategoryContainer>

                        <ProductsGrid>
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id}>
                                    {product.imagem && (
                                        <img
                                            src={`data:image/jpeg;base64,${product.imagem}`}
                                            alt={product.nome}
                                        />
                                    )}
                                    <p>{product.nome}</p>
                                    <p><strong>R$ {product.preco_venda} / {product.unidade === "Kg" ? "Kg" : "Un"}</strong></p>
                                    <IconButtonHeader onClick={() => openQuantityModal(product)}>Selecionar</IconButtonHeader>
                                </ProductCard>
                            ))}
                        </ProductsGrid>


                        {isQuantityModalOpen && (
                            <ModalOverlay>
                                <QuantityModalContent>
                                    <CloseButton onClick={() => setIsQuantityModalOpen(false)}>×</CloseButton>
                                    <h2>Definir Quantidade</h2>
                                    <p><strong>{selectedProduct?.nome}</strong></p>
                                    <p>Preço: R$ {selectedProduct?.preco_venda} / {selectedProduct?.unidade === "Kg" ? "Kg" : "Un"}</p>

                                    <QuantityInput
                                        type="number"
                                        step={selectedProduct?.unidade === "Kg" ? "0.1" : "1"} // Permite fração para Kg
                                        min="0.1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />

                                    <ConfirmButton onClick={confirmAddProduct}>Confirmar</ConfirmButton>
                                </QuantityModalContent>
                            </ModalOverlay>
                        )}
                    </LeftSection>

                    <RightSection>
                        <SectionTitle>🛒 Itens Adicionados</SectionTitle>
                        <ReceiptContainer>
                            {pedido.map((item) => (
                                <ReceiptItem key={item.id}>
                                    <div className="info">
                                        <span className="nome">{item.nome}</span>
                                        <span className="preco">R$ {(item.preco_venda * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="quantidade">
                                        <IconButton onClick={() => decreaseQuantity(item.id)}>➖</IconButton>
                                        <span>{item.quantity}</span>
                                        <IconButton onClick={() => increaseQuantity(item.id)}>➕</IconButton>
                                    </div>
                                    <div className="remover">
                                        <IconButton onClick={() => removeFromPedido(item.id)}>❌</IconButton>
                                    </div>
                                </ReceiptItem>
                            ))}
                        </ReceiptContainer>
                        <FixedFooter>
                            <TotalContainer>
                                <TotalDisplay>Total: R$ {totalPedido.toFixed(2)}</TotalDisplay>
                            </TotalContainer>
                        </FixedFooter>
                    </RightSection>


                </ContentWrapper>

                {isModalOpen && (
                    <ModalOverlay>
                        <ModalContent>
                            <CloseButton onClick={closeModal}>×</CloseButton>
                            <h2>Finalizar Pedido</h2>

                            {/* 🔹 Tabela com os itens do pedido e opção de desconto por item */}
                            <ScrollableTableContainer>
                                <ProductTableWrapper>
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Qtd</th>
                                            <th>Preço Total</th>
                                            <th>Desconto (R$)</th>
                                            <th>Preço Final</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedido.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{item.nome}</td>
                                                <td>{item.quantity}</td>
                                                <td>R$ {(item.preco_venda * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <TaxaInput
                                                        type="number"
                                                        value={item.desconto || ""}
                                                        onChange={(e) => {
                                                            let desconto = parseFloat(e.target.value) || 0;
                                                            let precoTotalItem = item.preco_venda * item.quantity;

                                                            if (desconto > precoTotalItem) {
                                                                alert("O desconto não pode ser maior que o valor do item!");
                                                                desconto = precoTotalItem;
                                                            }

                                                            const newPedido = [...pedido];
                                                            newPedido[index] = { ...item, desconto };
                                                            setPedido(newPedido);
                                                        }}
                                                        placeholder="Desconto por item"
                                                    />
                                                </td>
                                                <td>
                                                    R$ {((item.preco_venda * item.quantity) - (item.desconto || 0)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </ProductTableWrapper>
                            </ScrollableTableContainer>

                            {/* 🔹 Exibição do subtotal, descontos e total final */}
                            <TotalContainer>
                                <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>
                                <p><strong>Taxa Adicional:</strong> R$ {parseFloat(taxaAdicional || 0).toFixed(2)}</p>
                                <TotalDisplay>
                                    <strong>Total Final:</strong> R$ {totalPedido.toFixed(2)}
                                </TotalDisplay>
                            </TotalContainer>

                            {/* 🔹 Campos de Observação e Nome do Cliente */}
                            <p>Adicione uma observação e taxa adicional:</p>
                            <ObservacaoInput
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                placeholder="Observação..."
                            />
                            <ObservacaoInput
                                value={ClienteNome}
                                onChange={(e) => setClienteNome(e.target.value)}
                                placeholder="Nome"
                            />
                            <TaxaInput
                                type="number"
                                value={taxaAdicional}
                                onChange={(e) => setTaxaAdicional(parseFloat(e.target.value) || 0)}
                                placeholder="Taxa Adicional (R$)"
                            />

                            <TaxaInput
                                type="number"
                                value={descontoTotal}
                                onChange={(e) => {
                                    let desconto = parseFloat(e.target.value) || "";

                                    if (desconto > subtotal) {
                                        alert("O desconto total não pode ser maior que o subtotal!");
                                        desconto = subtotal;
                                    }

                                    setDescontoTotal(desconto);
                                }}
                                placeholder="Desconto no total"
                            />

                            {/* 🔹 Botões de ação */}
                            <ModalActions>
                                <IconButtonHeader onClick={closeModal}>
                                    <FaTimes /> Cancelar
                                </IconButtonHeader>
                                <IconButtonHeader onClick={finalizarPedido}>
                                    <FaCheck /> Confirmar Pedido
                                </IconButtonHeader>
                            </ModalActions>
                        </ModalContent>
                    </ModalOverlay>
                )}



                <OperatorInfo>Usuario: {User.toUpperCase()} | Data:{" "}
                    {currentTime.toLocaleDateString()} | Hora:{" "}
                    {currentTime.toLocaleTimeString()}</OperatorInfo>
            </Container>
            {isListaPedidosOpen && (
                <ModalOverlay>
                    <ModalPedidosContent>
                        <CloseButton onClick={closeListaPedidos}>×</CloseButton>
                        <TitlePedidos>📋 Lista de Pedidos</TitlePedidos>

                        {/* 🔹 Campo de Pesquisa */}
                        <InputGroup>
                            <input
                                type="text"
                                placeholder="🔎 Buscar por ID ou Cliente..."
                                value={searchTermPedidos}
                                onChange={(e) => setSearchTermPedidos(e.target.value)}
                            />
                        </InputGroup>

                        {filteredPedidos.length === 0 ? (
                            <p>Nenhum pedido encontrado.</p>
                        ) : (
                            <ListaPedidosScrollable>
                                <ListaPedidosGrid>
                                    {filteredPedidos.map((pedido) => (
                                        <PedidoCard key={pedido.id} status={pedido.status}>
                                            <p className="pedido-id">Pedido #{pedido.id}</p>
                                            <p><strong>Cliente:</strong> {pedido.cliente || "Não identificado"}</p>
                                            <p className="pedido-total"><strong>Total:</strong> R$ {pedido.total || "0.00"}</p>
                                            <p><strong>Taxa:</strong> R$ {pedido.taxa_entrega || "0.00"}</p>
                                            <p className="pedido-status"><strong>Status:</strong> {pedido.status === "P" ? "Pendente" : "Finalizado"}</p>

                                            <p className="pedido-info">Data: {pedido.data_pedido}</p>
                                            <p className="pedido-info">Hora: {pedido.hora_pedido}</p>
                                            {/* 🔹 Botões de Ação */}
                                            <ModalButtons>
                                                <IconButtonHeader onClick={() => openPedidoDetalhes(pedido)}>
                                                    ✏️ Editar
                                                </IconButtonHeader>
                                                <IconButtonHeader onClick={() => excluirPedido(pedido.id)}>
                                                    ❌ Excluir
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





            {pedidoSelecionado && (
                <ModalOverlay>
                    <ModalPedidoContent>
                        <CloseButton onClick={closePedidoDetalhes}>×</CloseButton>
                        <TitlePedido>✏️ Editar Pedido #{pedidoSelecionado.id}</TitlePedido>

                        {/* 🔹 Informações do Pedido */}
                        <PedidoInfo>
                            <p><strong>Cliente:</strong> {pedidoSelecionado.cliente}</p>
                            <p>
                                <strong>Taxa de Entrega:</strong>
                                <InputTaxa
                                    type="number"
                                    value={pedidoSelecionado.taxa_entrega}
                                    onChange={(e) => setPedidoSelecionado({
                                        ...pedidoSelecionado,
                                        taxa_entrega: parseFloat(e.target.value) || 0
                                    })}
                                />
                            </p>
                        </PedidoInfo>

                        {/* 🔹 Campo para Observação */}
                        <ObservacaoContainer>
                            <strong>Observação:</strong>
                            <ObservacaoInput
                                value={pedidoSelecionado.observacao || ""}
                                onChange={(e) => setPedidoSelecionado({
                                    ...pedidoSelecionado,
                                    observacao: e.target.value
                                })}
                                placeholder="Digite uma observação para o pedido..."
                            />
                        </ObservacaoContainer>

                        {/* 🔹 Tabela de Itens do Pedido */}
                        <ScrollableTableContainer>
                            <ProductTableWrapper>
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Qtd</th>
                                        <th>Preço Total</th>
                                        <th>➕</th>
                                        <th>➖</th>
                                        <th>❌</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidoSelecionado.itens.map((item) => (
                                        <tr key={item.produto_id}>
                                            <td>{item.produto_nome || item.nome || "Nome não encontrado"}</td>
                                            <td>{Number(item.quantidade).toFixed(3)}</td>

                                            <td>R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</td>
                                            <td>
                                                <IconButton onClick={() => editarQuantidade(item.produto_id, item.quantidade + 1)}>+</IconButton>
                                            </td>
                                            <td>
                                                <IconButton onClick={() => editarQuantidade(item.produto_id, item.quantidade - 1)}>-</IconButton>
                                            </td>
                                            <td>
                                                <IconButton onClick={() => removerItem(item.produto_id)}>🗑️</IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </ProductTableWrapper>
                        </ScrollableTableContainer>

                        {/* 🔹 Exibir Total do Pedido */}
                        <TotalContainer>
                            <TotalDisplay>
                                <strong>Total do Pedido:</strong> R$ {pedidoSelecionado.itens.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0).toFixed(2)}
                            </TotalDisplay>
                        </TotalContainer>

                        {/* 🔹 Botões de Ação */}
                        <ModalButtons>
                            <IconButtonHeader onClick={salvarAlteracoesPedido}>
                                <FaCheck /> Salvar Alterações
                            </IconButtonHeader>
                            <IconButtonHeader onClick={openAddProductModal}>
                                <FaPlus /> Adicionar Produtos
                            </IconButtonHeader>
                        </ModalButtons>
                    </ModalPedidoContent>
                </ModalOverlay>
            )}


            {isAddProductModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <CloseButton onClick={closeAddProductModal}>×</CloseButton>
                        <h2>Adicionar Produtos</h2>

                        {mensagemSucesso && <p style={{ color: "green", fontWeight: "bold" }}>{mensagemSucesso}</p>}

                        {/* Campo de Pesquisa */}
                        <SearchInputModal
                            type="text"
                            placeholder="Pesquisar produto..."
                            value={searchProductTerm}
                            onChange={(e) => setSearchProductTerm(e.target.value)}
                        />

                        {/* Filtro por Categoria */}
                        <CategoryFilterContainer>
                            <IconButtonHeader
                                active={selectedModalCategory === ""}
                                onClick={() => setSelectedModalCategory("")}
                            >
                                Todas
                            </IconButtonHeader>
                            {categories.map((category) => (
                                <IconButtonHeader
                                    key={category}
                                    active={selectedModalCategory === category}
                                    onClick={() => setSelectedModalCategory(category)}
                                >
                                    {category}
                                </IconButtonHeader>
                            ))}
                        </CategoryFilterContainer>

                        {/* Lista de Produtos */}
                        <ProductsGrid>
                            {filteredModalProducts.map((product) => (
                                <ModalProductCard key={product.id}>
                                    {product.imagem && (
                                        <img src={`data:image/jpeg;base64,${product.imagem}`} alt={product.nome} />
                                    )}
                                    <p>{product.nome}</p>
                                    <p><strong>R$ {product.preco_venda} / {product.unidade === "Kg" ? "Kg" : "Un"}</strong></p>
                                    <IconButtonHeader
                                        onClick={() => openQuantityModalEdit(product)}
                                    >
                                        Selecionar
                                    </IconButtonHeader>
                                </ModalProductCard>
                            ))}
                        </ProductsGrid>
                    </ModalContent>
                    {/* 🔹 Modal para Definir Quantidade */}
                    {isQuantityModalOpenEdit && (
                        <ModalOverlay>
                            <QuantityModalContent>
                                <CloseButton onClick={() => setIsQuantityModalOpenEdit(false)}>×</CloseButton>
                                <h2>Definir Quantidade</h2>
                                <p><strong>{selectedProduct?.nome}</strong></p>
                                <p>Preço: R$ {selectedProduct?.preco_venda} / {selectedProduct?.unidade === "Kg" ? "Kg" : "Un"}</p>

                                <QuantityInput
                                    type="number"
                                    step={selectedProduct?.unidade === "Kg" ? "0.1" : "1"} // Permite fração para Kg
                                    min="0.1"
                                    value={quantityEdit}
                                    onChange={(e) => setQuantityEdit(parseFloat(e.target.value))}
                                />

                                <ConfirmButton onClick={confirmAddProductEdit}>Confirmar</ConfirmButton>
                            </QuantityModalContent>
                        </ModalOverlay>
                    )}

                </ModalOverlay>
            )}



        </>
    );
};

export default Pedidos;
