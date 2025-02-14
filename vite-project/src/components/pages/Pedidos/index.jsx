import { useEffect, useState } from "react";
import { FaCheck, FaTrash, FaSearch, FaPlus, FaMinus, FaTimes, FaList } from "react-icons/fa";
import {
    HeaderContainer, Title, ButtonContainer, IconButton, RightSection, LeftSection, Container, TotalContainer,
    TotalDisplay, ContentWrapper, ButtonGroup, SectionTitle, ScrollableTableContainer, TableIcon, SearchContainer,
    SearchInput, CategoryContainer, CategoryButton, ProductsGrid, ProductCard, SelectButton, ModalOverlay, ModalContent,
    CloseButton, ModalActions, ObservacaoInput, TaxaInput, ButtonTotal, FixedFooter, OperatorInfo, ProductTableWrapper,
    ListaPedidosGrid,
    PedidoCard,
    ModalProductCard,
    SearchInputModal,
    CategoryFilterContainer,
    SelectButtonModal,
    ModalPedidosContent,
    ListaPedidosScrollable,
    TitlePedidos,
    ModalPedidoContent,
    TitlePedido,
    PedidoInfo,
    ModalButtons,
    StyledButton,
    InputTaxa
} from "./styles";

const Pedidos = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pedido, setPedido] = useState([]);
    const [observacao, setObservacao] = useState("");
    const [taxaAdicional, setTaxaAdicional] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListaPedidosOpen, setIsListaPedidosOpen] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchProductTerm, setSearchProductTerm] = useState("");
    const [selectedModalCategory, setSelectedModalCategory] = useState("");
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState(""); // 🔹 Estado para mensagem de sucesso


    const openAddProductModal = () => setIsAddProductModalOpen(true);
    const closeAddProductModal = () => setIsAddProductModalOpen(false);


    const filteredModalProducts = products.filter(
        (product) =>
            product.nome.toLowerCase().includes(searchProductTerm.toLowerCase()) &&
            (selectedModalCategory === "" || product.categoria_nome === selectedModalCategory)
    );

    useEffect(() => {
        carregarProdutos();
        carregarPedidos();
    }, []);

    const carregarProdutos = () => {
        fetch("http://localhost:5000/produtos")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                const categoriasUnicas = [...new Set(data.map((prod) => prod.categoria_nome))];
                setCategories(categoriasUnicas);
            })
            .catch((error) => console.error("Erro ao carregar produtos:", error));
    };

    const carregarPedidos = () => {
        fetch("http://localhost:5000/pedidos")
            .then((res) => res.json())
            .then((data) => setPedidos(data))
            .catch((error) => console.error("Erro ao carregar pedidos:", error));
    };

    const editarQuantidade = (produtoId, novaQuantidade) => {
        setPedidoSelecionado((prevPedido) => {
            const itensAtualizados = prevPedido.itens.map((item) =>
                item.produto_id === produtoId ? { ...item, quantidade: novaQuantidade } : item
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

        try {
            await fetch(`http://localhost:5000/pedidos/${id}`, { method: "DELETE" });
            alert("Pedido excluído com sucesso!");
            setPedidos(pedidos.filter(p => p.id !== id));
            closePedidoDetalhes();
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

    const addToPedido = (product) => {
        setPedido((prevPedido) => {
            const existingProduct = prevPedido.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevPedido.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevPedido, { ...product, quantity: 1 }];
            }
        });
    };

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

    const subtotal = pedido.reduce((total, item) => total + item.preco_venda * item.quantity, 0);
    const totalPedido = subtotal + parseFloat(taxaAdicional || 0);



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

    const adicionarProdutoAoPedido = (produto) => {
        setPedidoSelecionado((prevPedido) => {
            const produtoExistente = prevPedido.itens.find((item) => item.produto_id === produto.id);

            let novoPedido;

            if (produtoExistente) {
                novoPedido = {
                    ...prevPedido,
                    itens: prevPedido.itens.map((item) =>
                        item.produto_id === produto.id
                            ? { ...item, quantidade: item.quantidade + 1 }
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
                            produto_nome: produto.nome, // 🔹 Garante que o nome seja salvo corretamente
                            quantidade: 1,
                            preco_unitario: produto.preco_venda
                        }
                    ],
                };
            }

            return novoPedido;
        });

        // 🔹 Define a mensagem de sucesso
        setMensagemSucesso(`✅ ${produto.nome} foi adicionado ao pedido!`);

        // 🔹 Remove a mensagem após 2 segundos
        setTimeout(() => setMensagemSucesso(""), 2000);
    };



    const salvarAlteracoesPedido = async () => {
        if (!pedidoSelecionado) return;

        const pedidoAtualizado = {
            cliente: pedidoSelecionado.cliente,
            total: Number(pedidoSelecionado.itens.reduce((total, item) => total + item.preco_unitario * item.quantidade, 0).toFixed(2)),
            taxa_entrega: Number(pedidoSelecionado.taxa_entrega),  // 🔹 Atualizando taxa
            observacao: pedidoSelecionado.observacao,
            itens: pedidoSelecionado.itens.map((item) => ({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: Number(item.preco_unitario),
            })),
        };

        try {
            const response = await fetch(`http://localhost:5000/pedidos/${pedidoSelecionado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedidoAtualizado),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Pedido atualizado com sucesso!");
                carregarPedidos();
                setPedidoSelecionado(null);
            } else {
                alert(`Erro ao atualizar pedido: ${result.error}`);
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
            cliente: "Cliente Padrão",  // Pode ser modificado para pegar do usuário
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
            const response = await fetch("http://localhost:5000/pedidos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedidoData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Pedido criado com sucesso! ID: ${result.id}`);
                setPedido([]);
                setObservacao("");
                setTaxaAdicional(0);
                setIsModalOpen(false);
            } else {
                alert(`Erro ao criar pedido: ${result.error}`);
            }
        } catch (error) {
            alert("Erro ao conectar com a API");
            console.error("Erro ao enviar pedido:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <Container>
                <HeaderContainer>
                    <Title>Pedidos</Title>
                    <ButtonContainer>
                        <IconButton>
                            <FaPlus />
                            <span>Novo Pedido</span>
                        </IconButton>
                        <IconButton onClick={openListaPedidos}>
                            <FaList />
                            <span>Lista de Pedidos</span>
                        </IconButton>
                        <IconButton onClick={openModal}>
                            <FaCheck />
                            <span>Finalizar</span>
                        </IconButton>
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
                                <ButtonTotal
                                    key={category}
                                    className={selectedCategory === category ? "active" : ""}
                                    onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                                >
                                    {category}
                                </ButtonTotal>
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
                                    <p><strong>R$ {product.preco_venda}</strong></p>
                                    <SelectButton onClick={() => addToPedido(product)}>Selecionar</SelectButton>
                                </ProductCard>
                            ))}
                        </ProductsGrid>
                    </LeftSection>

                    <RightSection>
                        <SectionTitle>🛒 Itens Adicionados</SectionTitle>
                        <ScrollableTableContainer>
                            <ProductTableWrapper>
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Qtd</th>
                                        <th>Preço Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedido.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.nome}</td>
                                            <td>{item.quantity}</td>
                                            <td>R$ {(item.preco_venda * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </ProductTableWrapper>
                        </ScrollableTableContainer>
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

                            {/* 🔹 Tabela com os itens do pedido */}
                            <ScrollableTableContainer>
                                <ProductTableWrapper>
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Qtd</th>
                                            <th>Preço Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedido.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.nome}</td>
                                                <td>{item.quantity}</td>
                                                <td>R$ {(item.preco_venda * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </ProductTableWrapper>
                            </ScrollableTableContainer>

                            {/* 🔹 Exibição do total e taxa adicional */}
                            <TotalContainer>
                                <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>
                                <p><strong>Taxa Adicional:</strong> R$ {parseFloat(taxaAdicional || 0).toFixed(2)}</p>
                                <TotalDisplay>
                                    <strong>Total Final:</strong> R$ {totalPedido.toFixed(2)}
                                </TotalDisplay>
                            </TotalContainer>

                            {/* 🔹 Campos de Observação e Taxa Adicional */}
                            <p>Adicione uma observação e taxa adicional:</p>
                            <ObservacaoInput
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                placeholder="Observação..."
                            />
                            <TaxaInput
                                type="number"
                                value={taxaAdicional}
                                onChange={(e) => setTaxaAdicional(e.target.value)}
                                placeholder="Taxa Adicional (R$)"
                            />

                            {/* 🔹 Botões de ação */}
                            <ModalActions>
                                <ButtonTotal onClick={closeModal}>
                                    <FaTimes /> Cancelar
                                </ButtonTotal>
                                <ButtonTotal onClick={finalizarPedido}>
                                    <FaCheck /> Confirmar Pedido
                                </ButtonTotal>
                            </ModalActions>
                        </ModalContent>
                    </ModalOverlay>
                )}

                <OperatorInfo>Operador:</OperatorInfo>
            </Container>
            {isListaPedidosOpen && (
                <ModalOverlay>
                    <ModalPedidosContent>
                        <CloseButton onClick={closeListaPedidos}>×</CloseButton>
                        <TitlePedidos>📋 Lista de Pedidos</TitlePedidos> {/* 🔹 Título Estilizado */}

                        {/* 🔹 Agora a lista tem scroll interno */}
                        <ListaPedidosScrollable>
                            <ListaPedidosGrid>
                                {pedidos.map((pedido) => (
                                    <PedidoCard
                                        key={pedido.id}
                                        status={pedido.status}
                                        onClick={() => openPedidoDetalhes(pedido)}
                                    >
                                        <p className="pedido-id">Pedido #{pedido.id}</p>
                                        <p><strong>Cliente:</strong> {pedido.cliente}</p>
                                        <p className="pedido-total"><strong>Total:</strong> R$ {pedido.total}</p>
                                        <p><strong>Taxa:</strong> R$ {pedido.taxa_entrega}</p>
                                        <p className="pedido-status">{pedido.status}</p>
                                    </PedidoCard>
                                ))}
                            </ListaPedidosGrid>
                        </ListaPedidosScrollable>
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
                        onChange={(e) => setPedidoSelecionado({ ...pedidoSelecionado, taxa_entrega: e.target.value })}
                    />
                </p>
            </PedidoInfo>

            {/* 🔹 Tabela de Itens do Pedido */}
            <ScrollableTableContainer>
                <ProductTableWrapper>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Qtd</th>
                            <th>Preço Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidoSelecionado.itens.map((item) => (
                            <tr key={item.produto_id}>
                                <td>{item.produto_nome || item.nome || "Nome não encontrado"}</td>
                                <td>{item.quantidade}</td>
                                <td>R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => editarQuantidade(item.produto_id, item.quantidade - 1)}>-</button>
                                    <button onClick={() => editarQuantidade(item.produto_id, item.quantidade + 1)}>+</button>
                                    <button onClick={() => removerItem(item.produto_id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </ProductTableWrapper>
            </ScrollableTableContainer>

            {/* 🔹 Botões de Ação */}
            <ModalButtons>
                <StyledButton onClick={salvarAlteracoesPedido}>
                    <FaCheck /> Salvar Alterações
                </StyledButton>
                <StyledButton onClick={closePedidoDetalhes}>
                    <FaTimes /> Fechar
                </StyledButton>
                <StyledButton onClick={openAddProductModal}>
                    <FaPlus /> Adicionar Produtos
                </StyledButton>
            </ModalButtons>
        </ModalPedidoContent>
    </ModalOverlay>
)}


            {isAddProductModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <CloseButton onClick={closeAddProductModal}>×</CloseButton>
                        <h2>Adicionar Produtos</h2>

                        {/* 🔹 Exibe a mensagem de sucesso */}
                        {mensagemSucesso && <p style={{ color: "green", fontWeight: "bold" }}>{mensagemSucesso}</p>}

                        {/* 🔹 Campo de Pesquisa */}
                        <SearchInputModal
                            type="text"
                            placeholder="Pesquisar produto..."
                            value={searchProductTerm}
                            onChange={(e) => setSearchProductTerm(e.target.value)}
                        />

                        {/* 🔹 Filtro por Categoria */}
                        <CategoryFilterContainer>
                            <ButtonTotal
                                active={selectedModalCategory === ""}
                                onClick={() => setSelectedModalCategory("")}
                            >
                                Todas
                            </ButtonTotal>
                            {categories.map((category) => (
                                <ButtonTotal
                                    key={category}
                                    active={selectedModalCategory === category}
                                    onClick={() => setSelectedModalCategory(category)}
                                >
                                    {category}
                                </ButtonTotal>
                            ))}
                        </CategoryFilterContainer>

                        {/* 🔹 Grid de Produtos */}
                        <ProductsGrid>
                            {filteredModalProducts.map((product) => (
                                <ModalProductCard key={product.id}>
                                    {product.imagem && (
                                        <img src={`data:image/jpeg;base64,${product.imagem}`} alt={product.nome} />
                                    )}
                                    <p>{product.nome}</p>
                                    <p><strong>R$ {product.preco_venda}</strong></p>
                                    <SelectButtonModal onClick={() => adicionarProdutoAoPedido(product)}>Adicionar</SelectButtonModal>
                                </ModalProductCard>
                            ))}
                        </ProductsGrid>
                    </ModalContent>
                </ModalOverlay>
            )}

        </>
    );
};

export default Pedidos;
