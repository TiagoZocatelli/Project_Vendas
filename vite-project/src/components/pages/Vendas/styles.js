import styled, {keyframes } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Garante que o container ocupe toda a tela */
  padding: 8px;
  position: relative;
  
`;

// 🔹 Grupo de Botões
export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;


export const IconButton = styled.button`
  background: rgba(255, 132, 0, 1);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: #E65100;
  }
`;

export const ProductDisplay = styled.div`
  background: linear-gradient(
    145deg,
    #102c57,
    #0056b3
  ); /* Azul escuro com gradiente */
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const ReceiptContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 500px; /* 🔹 Largura fixa para manter padrão */
  height: 450px; /* 🔹 Altura fixa para garantir visual equilibrado */
  overflow-y: auto;
  border: 2px dashed rgba(0, 0, 0, 0.2); /* Estilo cupom */
  position: relative;

  /* Scroll suave para evitar rolagem abrupta */
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


export const ReceiptItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);

  .info {
    display: flex;
    flex-direction: column;
    width: 60%;
  }

  .nome {
    font-weight: bold;
    font-size: 0.9rem;
    color: #333;
  }

  .preco {
    font-size: 0.8rem;
    color: #777;
  }

  .quantidade {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .remover {
    margin-left: 10px;
  }
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

export const SectionTitle = styled.h3`
  font-size: 2.3rem;
  font-weight: bold;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1; /* Ocupa todo o espaço disponível entre o Header e o OperatorInfo */
  gap: 20px;
  overflow: hidden; /* Impede que o conteúdo extrapole */
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #102c57, #0056b3);
  border-radius: 32px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  height: 100%;
  color: white;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  overflow: auto;
`;

export const RightSection = styled.div`
  flex: 1;
  background: linear-gradient(145deg, #102c57, #0056b3);
  border-radius: 32px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 100%;
  max-width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Mantém o rodapé fixo no final */
`;


export const ProductImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  border: 3px solid white;
`;

export const IconButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
`;


export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$bgColor || "#0056b3"};
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 4px 4px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  margin-bottom: 8px;
`;



export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

export const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(145deg, #ffffff, #f3f3f3);
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 50%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 1.2rem;
    color: #102c57; /* Azul escuro */
    margin: 10px 0;
  }

  p {
    font-size: 1rem;
    font-weight: bold;
    color: #ff9800; /* Laranja vibrante */
    margin-bottom: 15px;
  }

  button {
    width: 100%;
    padding: 10px;
    background: linear-gradient(
      145deg,
      #ff9800,
      #f57c00
    ); /* Gradiente laranja */
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: linear-gradient(145deg, #f57c00, #e65100);
    }
  }
`;

export const ProductList = styled.div`
  max-height: 60%;
  overflow-y: auto;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
`;

export const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  span {
    font-size: 1rem;
    color: #555;
  }

  button {
    background: none;
    border: none;
    color: #e53935;
    cursor: pointer;

    &:hover {
      color: #c62828;
    }
  }
`;

export const TotalSection = styled.div`
  margin-top: 20px;
  background-color: #fbc02d; /* Amarelo vibrante */
  color: black;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 2.2rem;
    font-weight: bold;
    margin: 0;
  }
`;
export const PaymentModalContainer = styled.div`
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 30px;
  width: 1200px;
  max-width: 90%;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -45%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

// 🔹 Campo de Pagamento
export const PaymentInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-top: 5px;
  background-color: #f8f9fa;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border: 1px solid #007bff;
  }
`;

// 🔹 Select do Método de Pagamento
export const PaymentSelect = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-top: 5px;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border: 1px solid #007bff;
  }
`;

// 🔹 Lista de Pagamentos
export const PaymentHistoryList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 1.1rem;
  color: #555;

  li {
    margin-bottom: 5px;
    strong {
      color: #007bff;
    }
  }
`;

// 🔹 Histórico de Pagamento
export const PaymentHistoryContainer = styled.div`
  margin-top: 20px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
`;

// 🔹 Texto do Histórico
export const PaymentHistoryText = styled.h3`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 10px;
`;

// 🔹 Título do Modal
export const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
`;

// 🔹 Botões de Ação
export const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background-color: ${(props) =>
    props.variant === "confirm"
      ? "#28a745"
      : props.variant === "finalize"
      ? "#007bff"
      : "#dc3545"};

  &:hover {
    filter: brightness(90%);
  }
`;

export const PaymentModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

  h2 {
    margin-bottom: 20px;
    color: #0288d1;
    text-align: center;
  }

  button {
    width: 100%;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 10px 0;
    padding: 10px;
    border-radius: 8px;
  }
`;

export const CloseButton = styled.button`
  top: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;

  &:hover {
    color: #f44336;
  }
`;

export const ProductModal = styled(PaymentModal)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center; /* Centraliza verticalmente */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

export const ProductModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 32px;
  padding: 20px;
  width: 90%;
  max-width: 1500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

  h2 {
    text-align: center;
    font-size: 2rem;
    color: linear-gradient(145deg, #102c57, #0056b3);
    margin-bottom: 20px;
  }

  input {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-bottom: 20px;

    &:focus {
      outline: none;
      border-color: #0288d1;
    }
  }
`;

export const CategorySection = styled.div`
  margin-bottom: 30px;

  h3 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 15px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
  }
`;

export const HighlightedTotal = styled.div`
  background-color: #f44336; /* Vermelho vibrante */
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const OperatorInfo = styled.div`
  position: relative;
  width: 100%;
  background: linear-gradient(145deg, #102c57, #0056b3);
  color: #FFFFFF;
  text-align: center;
  padding: 12px 0;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 8px;
  border-radius: 32px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animação de saída (fade-out)
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Estilização da Notificação
export const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ type }) =>
    type === "success"
      ? "linear-gradient(145deg, #4caf50, #81c784)" // Verde para sucesso
      : "linear-gradient(145deg, #ff6347, #ff867f)"}; // Vermelho para erro
  color: #ffffff;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  font-weight: bold;
  z-index: 999999;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${fadeIn} 0.5s ease, ${fadeOut} 0.5s ease 3s forwards;
  min-width: 250px;
  max-width: 400px;
  text-align: center;
  justify-content: center;

  svg {
    font-size: 1.5rem;
  }
`;

export const SettingsIcon = styled.div`
  position: absolute;
  top: 30px;
  right: 90px;
  cursor: pointer;
  font-size: 2rem;
  color: rgb(255, 255, 255); /* Dourado para destacar */
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: rotate(30deg);
  }
`;

export const SettingsModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white; /* Azul escuro profissional */
  color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  width: 700px;
  max-width: 100%;
  text-align: center;
  z-index: 10000;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #000; /* Dourado para destaque */
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(1, 1, 1, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const SettingsLabel = styled.label`
  display: block;
  text-align: left;
  margin-top: 12px;
  font-size: 1rem;
  font-weight: bold;
  color: #FFD700; /* Dourado para melhor contraste */
`;

export const SettingsSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 6px;
  background: #ffffff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  color: #000;

  &:focus {
    outline: none;
  }
`;

export const SettingsInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 2px solid #FFD700;
  background: #1C1C1C;
  color: white;
  font-size: 1rem;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #E6C300;
  }
`;

export const SettingsCheckbox = styled.input`
  margin-top: 10px;
  transform: scale(1.3);
  cursor: pointer;
`;

export const SettingsButton = styled.button`
  margin-top: 20px;
  padding: 12px;
  background: rgba(255, 132, 0, 1); /* Dourado vibrante */
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #E65100; /* Laranja Escuro (Combina Melhor) */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4); /* Destaque sutil */
  }
`;
export const DivDesc = styled.div`
  display: flex; /* Para centralizar itens dentro do DivDesc */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  margin-bottom: 16px;
`;

export const HighlightedProduct = styled.div`
  background: linear-gradient(145deg, #102c57, #0056b3);
  color:rgb(255, 255, 255); /* Branco puro para melhor contraste */
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  width: 95%;
  padding: 10px; /* Melhor espaçamento */
  border-radius: 32px;

  /* Layout responsivo */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  h3 {
    font-size: 2.8rem;
    margin-bottom: 8px;
    color:rgb(255, 255, 255); /* Azul claro suave para destaque */
  }

  p {
    font-size: 1.6rem;
    margin: 5px 0;
    color: #D9D9D9; /* Cinza claro refinado */
  }

  span {
    font-size: 1.8rem;
    font-weight: bold;
    color:rgb(255, 255, 255); /* Azul metálico para pequenos destaques */
  }
`;

// 🔹 Container do Total
export const TotalContainer = styled.div`
  background: #ffffff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-top: 8px;
`;


export const ProductTable = styled.div`
  width: 100%;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden; /* Garante que o scroll fique dentro do container */

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #102c57;
    color: white;
    
  }

  th,
  td {
    padding: 5px 15px;
    text-align: center;
    border: 1px solid #ddd;
    font-size: 1rem;
    white-space: nowrap; /* Evita que o texto quebre */
  }

  th {
    font-weight: bold;
  }

  td {
    color: #555;
  }

  tbody {
    display: block; /* Permite o scroll no corpo */
    max-height: 400px; /* Altura máxima para o scroll */
    overflow-y: auto; /* Ativa o scroll vertical */
    width: 100%; /* Garante a largura */
  }

  tbody tr {
    display: table; /* Exibe as linhas como tabela */
    width: 100%; /* Garante largura total */
    table-layout: fixed; /* Define colunas com larguras iguais */
  }

  thead,
  tbody tr {
    display: table; /* O cabeçalho e as linhas do corpo precisam ser exibidos como tabela */
    width: 100%; /* Alinhamento consistente */
    table-layout: fixed; /* Tamanhos iguais para todas as colunas */
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9; /* Cor alternada */
  }

  tbody tr:hover {
    background-color: #f1f1f1; /* Destaque no hover */
  }

  img {
    max-width: 50px;
    max-height: 50px;
    object-fit: cover;
    border-radius: 8px;
  }

  button {
    background-color: #f44336; /* Vermelho */
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #d32f2f;
    }
  }
`;

export const ContainerTableTotal = styled.div`
max-height: 450px;
overflow-y: auto;
width: 100%;
background-color: #ffffff;
`

export const ProductTableWrapper = styled.div`
width: 100%;
overflow-y: auto;
border: 1px solid #ddd;
border-radius: 8px;
background: white;
padding: 10px;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Garante que a tabela ocupe toda a largura disponível */
}

thead {
  background: linear-gradient(145deg, #1e3a5f, #0056b3);
  color: white;
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 0.6rem;
  width: 100%;
  display: table;
  table-layout: fixed;
}

th,
td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
  width: auto;
}

th {
  font-weight: bold;
  text-transform: uppercase;
}

tbody {
  display: block;
  max-height: 700px;
  overflow-y: auto;
  width: 100%;
}

tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
  transition: background-color 0.3s;
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

tbody tr:hover {
  background-color: #dce8f5;
}

img {
  max-width: 50px;
  max-height: 50px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s;
}

img:hover {
  transform: scale(1.1);
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #d32f2f;
    transform: scale(1.05);
  }
}
`;


// 🔹 Texto do Total
export const TotalDisplay = styled.p`
  font-size: 2.4rem;
  font-weight: bold;
`;
