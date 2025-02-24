import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Garante que o container ocupe toda a tela */
  padding: 8px;
  position: relative;
  
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
`;


export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

export const HeaderCart = styled.div`
  display: flex;
  justify-content: space-between;
  background: #102C57;
  color: white;
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: center;
  font-size: 0.8rem;

  span {
    flex: 1; /* Distribui os elementos igualmente */
    text-align: center;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 2.3rem;
  font-weight: bold;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
`;

export const ScrollableTableContainer = styled.div`
  flex: 1;
  max-height: 600px; /* Define um limite para a tabela */
  overflow-y: auto; /* Apenas a tabela rola */
  margin-bottom: 10px;
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
  gap: 16px;
  width: 100%;
  overflow-y: auto;
  height: 100%; /* 🔹 Ocupa toda a altura disponível */
  padding: 10px;
  justify-items: center;

  &::-webkit-scrollbar {
    width: 14px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 132, 0, 1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const ProductCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 250, 250, 1)); 
  width: 200px;
  height: 280px; /* Ajuste para espaçamento ideal */
  padding: 12px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); /* Sombra mais refinada */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  background-clip: padding-box;

  &:hover {
    transform: translateY(-5px); /* Leve elevação */
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.25);
    border: 2px solid rgba(255, 132, 0, 0.8); /* Mantém o mesmo tom no hover */
  }

  img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 12px;
    transition: 0.3s ease-in-out;
    border: 3px solid rgba(255, 132, 0, 0.7);

    &:hover {
      transform: scale(1.07);
      border-color: rgba(255, 132, 0, 1);
    }
  }

  p {
    font-size: 0.9rem;
    font-weight: 600;
    color: #222;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6px;
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;
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
  margin-bottom: 16px;
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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* 🔹 Fundo preto cobrindo toda a tela */
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* 🔹 Preto com leve transparência */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
`;

export const ModalContent = styled.div`
  background: white; /* 🔹 Fundo branco para o modal */
  width: 70vw; /* 🔹 Ajuste conforme necessário */
  max-width: 1000px; /* 🔹 Evita que fique muito grande em telas grandes */
  height: 90vh;
  max-height: 700px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CloseButton = styled.button`
  right: 12px;
  background: linear-gradient(135deg, #ff5f5f, #d50000); /* 🔹 Gradiente para um efeito moderno */
  border-radius: 50%;
  width: 30px;
  height: 30px;
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
  min-height: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 0.9rem;
  resize: none;
  outline: none;
  transition: 0.3s;
  margin-bottom: 4px;

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
  margin-bottom: 4px;

  &:focus {
    border-color: #007bff;
    box-shadow: 0px 0px 5px rgba(0, 123, 255, 0.5);
  }
`;

export const DescontTaxaInput = styled(TaxaInput)`
  width: 30%;
`;

export const ModalProductCard = styled(ProductCard)`
    height: 280px;
    
    p {
      color: #000;
    }
`;

export const ModalPedidoContent = styled.div`
  background: white;
  width: 80vw; /* 🔹 Usa 80% da largura da tela */
  max-width: 1000px; /* 🔹 Mantém um tamanho máximo */
  height: 90vh;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: white;

  @media (max-width: 768px) {
    width: 90vw;
    height: 90vh;
  }
`;

export const TitlePedido = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid white;
`;

export const PedidoInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
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

export const FilialSelectContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f8f9fa;
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-weight: bold;
    color: #333;
`;

export const FilialSelect = styled.select`
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    &:hover {
        border-color: #0056b3;
    }
`;


// 🔹 Conteúdo do modal estilizado
export const QuantityModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  h2 {
    font-size: 1.4rem;
    color: #102C57;
    margin-bottom: 12px;
  }

  p {
    font-size: 1rem;
    color: #333;
    margin-bottom: 8px;
  }
`;

// 🔹 Input estilizado para quantidade
export const QuantityInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #102C57;
  border-radius: 8px;
  text-align: center;
  outline: none;
  transition: 0.3s ease-in-out;
  
  &:focus {
    border-color: #FF4500;
    box-shadow: 0px 0px 8px rgba(255, 69, 0, 0.5);
  }
`;

export const StyledButton = styled(ButtonTotal)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;