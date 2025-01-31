import styled, {keyframes } from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 20px;
  background: linear-gradient(
    145deg,
    #102c57,
    #0056b3
  ); 
  padding: 8px;
  height: 88vh;
`;

export const IconButtonGroup = styled.div`
  display: flex;
  gap: 10px; /* Espaçamento entre os botões */
  justify-content: center; /* Centraliza os botões */
  align-items: center;
  margin-top: 10px;
`;


export const IconButton = styled.button`
  background: ${(props) => props.$bgColor || "#0056b3"}; /* Cor padrão */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  margin: 5px;

  &:hover {
    background-color: #0056b3; /* Cor ao passar o mouse */
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border: 3px solid #FF9800;
  height: 79vh; /* Define altura do container */
  justify-content: space-between; /* Garante que o conteúdo se distribua */
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

export const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    font-size: 1.2rem;
    font-weight: bold;
    color: #444;
    margin-bottom: 8px;
    display: block;
  }

  input {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.3s;

    &:focus {
      border-color: #0288d1; /* Destaque ao focar */
      outline: none;
    }
  }
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

export const RightSection = styled.div`
  flex: 2;
  background-color: #ffffff;
  border: 3px solid #FF9800;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 79vh;
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
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  align-items: flex-start;
`;

export const ProductModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 1200px;
  max-height: 80vh;
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
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 100%;
  background: #102C57; /* Azul escuro profissional */
  color: #FFFFFF; /* Branco */
  text-align: center;
  padding: 12px 0;
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 4px solid #C8A52E; /* Dourado refinado para destaque */
  
  /* Responsividade */
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 8px 0;
  }
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
  top: 15px;
  right: 20px;
  cursor: pointer;
  font-size: 2rem;
  color: #FFD700; /* Dourado para destacar */
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
  background: #102C57; /* Azul escuro profissional */
  color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  width: 350px;
  max-width: 90%;
  text-align: center;
  z-index: 10000;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #FFD700; /* Dourado para destaque */
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
  border: 2px solid #FFD700; /* Dourado refinado */
  background: #1C1C1C;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #E6C300;
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
  background: #FFD700; /* Dourado vibrante */
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #E6C300;
  }
`;
export const DivDesc = styled.div`
  display: flex; /* Para centralizar itens dentro do DivDesc */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
`;

export const HighlightedProduct = styled.div`
  background: #102C57; /* Azul escuro sofisticado */
  color:rgb(255, 255, 255); /* Branco puro para melhor contraste */
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  width: 100%;
  border: 3px solid #FF9800; /* Prata metálico refinado */
  padding: 10px; /* Melhor espaçamento */

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




export const TotalContainer = styled.div`
  color: white;
  font-size: 2.2rem;
  font-weight: bold;
  text-align: center;
  border-radius: 12px;
  padding: 10px;

  span {
    display: block;
    margin-top: 10px;
    color: #ffeb3b;
    font-size: 1.5rem;
  }

  h3 {
    margin: 0;
    font-size: 3rem; /* Maior destaque para o total */
  }
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
    background: linear-gradient(145deg, #102c57, #0056b3);
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

export const ProductTableWrapper = styled.div`
width: 100%;
max-height: 500px;
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
  font-size: 0.8rem;
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
  max-height: 350px;
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


export const TotalDisplay = styled.div`
  background: linear-gradient(145deg, #102c57, #0056b3);
  color: #ffffff;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  span {
    margin-top: 10px;
    color: #ffcc00;
    font-size: 1.5rem;
  }
`;
