import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 20px;
  background: linear-gradient(
    145deg,
    #f0f8ff,
    #e3f2fd
  ); /* Fundo gradiente suave */
  padding: 20px;
  margin-left: 250px;
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
  background: ${(props) =>
    props.$bgColor ||
    "linear-gradient(145deg,  #102c57, #0056b3)"}; /* Gradiente para os botões */
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: bold;
  padding: 4px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  margin-bottom: 8px;
`;

export const RightSection = styled.div`
  flex: 2;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

export const DivDesc = styled.div`
  display: flex; /* Para centralizar itens dentro do DivDesc */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  margin-top: 80px;
  margin-left: 250px;
`;

export const HighlightedProduct = styled.div`
  background: linear-gradient(
    145deg,
    #102c57,
    #0056b3
  ); /* Gradiente Azul Escuro */
  color: white;
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
  border-radius: 16px;
  padding: 20px;
  width: 100%; /* Ocupa toda a largura do contêiner */
  max-width: 1600px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Sombra para destaque */

  /* Centralização dentro do DivDesc */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Ajuste de margens */
  margin: 0 auto; /* Remove espaços adicionais */
  box-sizing: border-box; /* Garante que padding e bordas não influenciem no tamanho */

  h3 {
    font-size: 3rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2rem;
    margin: 5px 0;
    color: #e0f7fa; /* Azul claro para contraste */
  }

  span {
    display: block;
    margin-top: 10px;
    font-size: 1.4rem;
    font-weight: normal;
    color: #ffeb3b; /* Amarelo para destaques menores */
  }
`;

export const TotalContainer = styled.div`
  color: white;
  font-size: 2.2rem;
  font-weight: bold;
  text-align: center;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;

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
    padding: 10px 15px;
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
