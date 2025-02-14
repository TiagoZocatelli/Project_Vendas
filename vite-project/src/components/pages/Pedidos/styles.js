import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Garante que o container ocupe toda a tela */
  padding: 8px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1; /* Ocupa todo o espaço disponível entre o Header e o OperatorInfo */
  gap: 20px;
  overflow: hidden; /* Impede que o conteúdo extrapole */
`;

export const RightSection = styled.div`
  flex: 1;
  background: #102c57;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 100%;
  max-width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Mantém o rodapé fixo no final */
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #102c57;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  height: 100%;
  color: white;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  overflow: auto;
`;

export const ContainerTableTotal = styled.div`
max-height: 450px;
overflow-y: auto;
width: 100%;
background-color: #ffffff;
`
export const ProductTableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  
  thead {
    background: linear-gradient(145deg, #1e3a5f, #0056b3);
    color: white;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 0.7rem;
  }

  th, td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    font-size: 0.9rem;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  button {
        background: linear-gradient(145deg, #1e3a5f, #0056b3);
        color: white;
        border: none;
        padding: 5px 8px;
        font-size: 12px;
        cursor: pointer;
        border-radius: 3px;
        margin: 0 3px; /* 🔹 Adiciona espaço entre os botões */
    }
`;


export const TotalContainer = styled.div`
  background: #ffffff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-top: 8px;
`;

// 🔹 Texto do Total
export const TotalDisplay = styled.p`
  font-size: 2.4rem;
  font-weight: bold;
  color: #ff6600;
`;
export const OperatorInfo = styled.div`
  position: relative;
  width: 100%;
  background: #102C57;
  color: #FFFFFF;
  text-align: center;
  padding: 12px 0;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 8px;
`;


export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #102c57;
  color: white;
  margin-bottom: 8px;
`;

export const Title = styled.h1`
  font-size: 32px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

export const SectionTitle = styled.h3`
  font-size: 2.3rem;
  font-weight: bold;
  color: #ff6600;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
`;

export const ScrollableTableContainer = styled.div`
  flex: 1;
  max-height: 400px; /* Define um limite para a tabela */
  overflow-y: auto; /* Apenas a tabela rola */
  margin-bottom: 10px;
`;

export const FixedFooter = styled.div`
  position: sticky;
  bottom: 0;

  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 100%;
`;


export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 18px;
`;

export const TableIcon = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 5px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #ff6600;
  
  &:hover {
    transform: scale(1.1);
  }

`;

export const ButtonTotal = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: 0.3s ease-in-out;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  color: #ff6600;

  &:hover {
    background-color: #ff4500;
    color: white;
  }

  &:active {
    transform: scale(0.95);
  }


  span {
    display: inline;
  }
`;




export const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  color: #ff6600;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: 0.3s ease;
  margin-left: 16px;

  &:hover {
    background-color: #ff4500;
    color: white;
  }

  span {
    display: none;
  }

  @media (min-width: 600px) {
    span {
      display: inline;
    }
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  width: 100%;
  margin-bottom: 10px;
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 8px;
  width: 100%;
  font-size: 0.9rem;
`;

export const CategoryContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const CategoryButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.3s ease-in-out;

  &:hover {
    background: #007bff;
    color: white;
  }

  &.active {
    background: #007bff;
    color: white;
  }
`;

export const ModalProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* 🔹 Layout mais responsivo */
    gap: 10px;
    max-height: 200px; /* 🔹 Define altura máxima para evitar que o modal fique grande demais */
    overflow-y: auto; /* 🔹 Adiciona rolagem vertical quando necessário */
    padding: 2px;
`;



export const SearchInputModal = styled.input`
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
`;

export const CategoryFilterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
`;

export const CategoryFilterButton = styled.button`
    border: 1px solid #ddd;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 5px;
    cursor: pointer;

`;


export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* 🔹 Mantém colunas proporcionais */
  gap: 10px;
  width: 100%;
  overflow-y: auto;
  max-height: 500px;
  padding: 10px;
  justify-items: center;
`;


export const ProductCard = styled.div`
  background: white;
  width: 180px;
  height: 220px; /* 🔹 Tamanho fixo para garantir uniformidade */
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  overflow: hidden;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.85rem;
    font-weight: bold;
    color: #333;
    flex-grow: 1; /* 🔹 Faz o texto ocupar espaço, mantendo o botão fixo na base */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5px;
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto; /* 🔹 Mantém o botão sempre na parte inferior */
  }
`;


export const SelectButton = styled.button`
  background: #ff4500;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
  width: 100%;
  height: 40px; /* 🔹 Altura fixa para todos os botões */
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ObservacaoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
`;



export const TaxaContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

export const ModalPedidosContent = styled.div`
  background: white;
  width: 100%; /* 🔹 O modal ocupa 80% da largura da tela * 🔹 Mantém um limite máximo para grandes telas */
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.3);
`;

export const ListaPedidosScrollable = styled.div`
  flex-grow: 1;
  overflow-y: auto; /* 🔹 Ativa a rolagem apenas na lista */
  padding: 10px; /* 🔹 Impede que o modal fique muito alto */
`;





export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  h2,p {
  }
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  p {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  button {
    margin-top: 10px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff5f5f, #d50000); /* 🔹 Gradiente para um efeito moderno */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out, opacity 0.3s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1); /* 🔹 Leve crescimento ao passar o mouse */
    opacity: 0.9;
    box-shadow: 0px 4px 10px rgba(255, 0, 0, 0.5);
  }

  &:active {
    transform: scale(0.95); /* 🔹 Animação ao clicar */
  }
`;


export const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

export const ObservacaoInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 0.9rem;
  resize: none;
  outline: none;
  transition: 0.3s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0px 0px 5px rgba(0, 123, 255, 0.5);
  }
`;

export const TaxaInput = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 0.9rem;
  text-align: center;
  outline: none;
  transition: 0.3s;
  margin-bottom: 16px;

  &:focus {
    border-color: #007bff;
    box-shadow: 0px 0px 5px rgba(0, 123, 255, 0.5);
  }
`;
export const TitlePedidos = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #102C57;
  text-align: center;
  margin-bottom: 15px; /* 🔹 Espaço abaixo do título */
  padding: 10px;
  border-bottom: 2px solid #102C57; /* 🔹 Linha de separação */
`;


export const ListaPedidosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 🔹 Mantemos espaçamento uniforme */
  gap: 16px; /* 🔹 Aumentamos o espaçamento entre os cartões */
  width: 100%;
  max-height: 800px;
  padding: 15px;
  justify-content: center; /* 🔹 Garante que os cartões fiquem centralizados */
`;


export const PedidoCard = styled.div`
  background: #fff;
  border: 2px solid #102C57;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
  min-height: 180px; /* 🔹 Mantém um tamanho uniforme */
  width: 250px; /* 🔹 Aumentamos a largura */
  gap: 8px; /* 🔹 Melhor espaçamento interno */

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.25); /* 🔹 Melhor efeito de destaque */
    background: #f8f8f8; /* 🔹 Fundo claro no hover ao invés do azul */
  }

  p {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin: 6px 0;
  }

  .pedido-id {
    font-size: 1.1rem;
    color: #102C57;
  }

  .pedido-total {
    font-size: 1.2rem;
    color: #FF4500; /* 🔹 Cor chamativa para o total */
  }

  .pedido-status {
    font-size: 0.85rem;
    color: white;
    background: ${({ status }) => 
      status === "Pendente" ? "#FFA500" : 
      status === "Finalizado" ? "#28A745" : 
      "#DC3545"};
    padding: 6px 12px;
    border-radius: 10px;
    margin-top: 8px;
    width: 100px;
    text-align: center;
  }
`;



export const SelectButtonModal = styled(SelectButton)`
  
`


export const ModalProductCard = styled(ProductCard)`
    height: 240px;
    
    p {
      color: #000;
    }
`;


export const ModalPedidoContent = styled.div`
  background: white;
  width: 80vw; /* 🔹 Usa 80% da largura da tela */
  max-width: 900px; /* 🔹 Mantém um tamanho máximo */
  height: 80vh;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 90vw;
    height: 90vh;
  }
`;

export const TitlePedido = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #102C57;
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #102C57;
`;

export const PedidoInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: bold;
  color: #333;

  p {
    margin: 5px 0;
  }
`;

export const InputTaxa = styled.input`
  width: 100px;
  padding: 6px;
  font-size: 1rem;
  border: 2px solid #102C57;
  border-radius: 6px;
  text-align: center;
  margin-left: 10px;
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  gap: 10px;
`;

export const StyledButton = styled(ButtonTotal)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;