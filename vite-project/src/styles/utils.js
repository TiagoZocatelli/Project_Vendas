import styled from "styled-components";
import { colors } from "./colors";


export const LeftButton = styled.div`
  position: fixed;
  top: 12px;
  left: 15px;
  width: 40px;
  height: 40px;
  background: ${colors.primaryRed};
  border-radius: 16px;
  color: white;
  border: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
`;

export const Container = styled.div`
  margin-left: 260px;
  margin-top: 48px;
  padding: 20px;
  min-height: 100vh;
  color: ${colors.textDark};

  h1 {
    text-align: center;
    margin-bottom: 16px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1; /* Ocupa todo o espaço disponível entre o Header e o OperatorInfo */
  gap: 20px;
  overflow: hidden; /* Impede que o conteúdo extrapole */
`;


export const SearchBar = styled.input`
  flex: 1; /* Faz o input ocupar o espaço restante */
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  background: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1e88e5;
    outline: none;
  }
`;

export const BackButton = styled.button`
  position: absolute;
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

export const RightSection = styled.div`
  flex: 1;
  background: linear-gradient(145deg, ${colors.primaryBlue}, ${colors.secondaryBlue});
  border-radius: 32px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 100%;
  max-width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;


export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, ${colors.primaryBlue}, ${colors.secondaryBlue});
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
`;


export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 🔹 Mantém os botões à direita */
  padding: 15px 20px;
  background: linear-gradient(145deg, #102c57, #0056b3);
  color: white;
  margin-bottom: 8px;
  position: relative;
  border-radius: 32px;
`;


export const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* 🔹 Mantém o título centralizado */
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  width: max-content;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* 🔹 Espaço entre os botões */
  margin-left: auto; /* 🔹 Mantém os botões alinhados à direita */
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


export const ModalPedidosContent = styled.div`
  background: white;
  width: 90vw; /* 🔹 Ocupa 70% da largura da tela */
  max-width: 1500px; /* 🔹 Define um limite máximo */
  height: 90vh; /* 🔹 Altura ajustada */
  max-height: 700px; /* 🔹 Evita que fique muito grande */
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 32px; /* 🔹 Deixa o modal mais bonito */
  position: relative;
`;

export const TitlePedidos = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px; /* 🔹 Espaço abaixo do título */
  padding: 10px;
  border-bottom: 2px solid #000; /* 🔹 Linha de separação */
`;


export const PedidoCard = styled.div`
  background: #fff;
  border: 2px solid #102C57;
  padding: 20px;
  border-radius: 32px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
  min-height: 100px; /* 🔹 Mantém um tamanho uniforme */
  width: 300px; /* 🔹 Aumentamos a largura */
  gap: 8px; /* 🔹 Melhor espaçamento interno */

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.25); /* 🔹 Melhor efeito de destaque */
    background: #f8f8f8; /* 🔹 Fundo claro no hover ao invés do azul */
  }

  p {
    font-size: 0.8rem;
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

export const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  gap: 10px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  label {
    font-size: 1rem;
    font-weight: bold;
    color: white;
    margin-bottom: 3px;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 2px solid #ffffff;
    border-radius: 5px;
    background-color: white;
    color: black;
    text-align: center;

    &:focus {
      border-color: #000;
      outline: none;
    }
  }
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


export const ListaPedidosScrollable = styled.div`
  flex-grow: 1;
  overflow-y: auto; /* 🔹 Ativa a rolagem apenas na lista */
  padding: 10px; /* 🔹 Impede que o modal fique muito alto */

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

export const IconButtonHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgb(255, 132, 0); /* Laranja Sofisticado */
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background 0.3s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.2s;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); /* Sombra mais discreta */
  color: white;
  letter-spacing: 0.8px;

  &:hover {
    background-color: #E65100; /* Laranja Escuro (Combina Melhor) */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4); /* Destaque sutil */
    transform: translateY(-1px); /* Elevação leve */
  }

  &:active {
    transform: scale(0.97);
    background-color: #BF360C; /* Laranja mais profundo para clique */
  }

  span {
    display: inline;
  }
`;

export const Button = styled.button`
  background-color: ${colors.secondaryBlue};
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s ease, transform 0.2s ease;
  margin-bottom: 4px;
  margin-left: 4px;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ActionIcon = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;

  svg {
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.2); /* Animação no hover */
    }
  }
`;

export const ConfirmModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fundo escuro semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

export const ConfirmModalContent = styled.div`
  background: #ffffff; /* Fundo branco puro */
  width: 100%;
  max-width: 400px; /* Largura máxima */
  padding: 25px 20px; /* Espaçamento interno */
  border-radius: 10px; /* Bordas arredondadas */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra suave */
  text-align: center;

  h2 {
    font-size: 1.4rem; /* Tamanho moderado */
    color: #1f2937; /* Cinza escuro */
    margin-bottom: 15px;
  }

  p {
    font-size: 1rem;
    color: #374151; /* Cinza médio */
    margin-bottom: 20px;
  }
`;

export const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center; /* Centraliza os botões */
  gap: 10px; /* Espaçamento suave entre os botões */
`;

export const ConfirmCancelButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  color: #ffffff;
  margin-top: 16px;
  margin-bottom: 8px;

  /* Cor do botão */
  background: #ef4444; /* Vermelho suave */
  &:hover {
    background: #dc2626; /* Vermelho mais escuro no hover */
  }
  &:active {
    transform: scale(0.97); /* Leve redução ao clicar */
  }
`;

export const ConfirmButton = styled(ConfirmCancelButton)`
  background: #0056b3; /* Cinza claro */
  color: #ffffff; /* Cinza escuro para texto */
  margin-right: 8px;

  &:hover {
    background:rgb(3, 67, 136); /* Cinza médio no hover */
  }
  &:active {
    transform: scale(0.97); /* Leve redução ao clicar */
  }
`;



export const Select = styled.select`
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  background: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1e88e5;
    outline: none;
  }
`;


export const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 1rem;
    color: #374151;
    font-weight: bold;
  }

  input, select {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    color: #1e293b;
    background: #f9fafb;
    transition: all 0.3s ease;

    &:focus {
      border-color: #2563eb;
      outline: none;
      box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
    }
  }
`;

export const AlignedContainer = styled.div`
  display: flex;
  flex-direction: column; /* Empilha os elementos verticalmente */
  align-items: stretch; /* Faz os elementos preencherem a largura disponível */
  gap: 16px; /* Espaçamento entre os elementos */
  width: 100%; /* Garante que o contêiner preencha toda a largura disponível */
  max-width: 800px; /* Largura máxima para manter uma boa aparência */
  margin: 0 auto; /* Centraliza o contêiner horizontalmente */
  padding: 20px; /* Adiciona espaçamento interno */
  background: #ffffff; /* Fundo branco */
  border-radius: 8px; /* Bordas arredondadas */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra leve */
`;


export const Label = styled.label`
  font-size: 1rem;
  color: #555555;
  font-weight: bold;
`;

export const Notification = styled.div`
   position: fixed;
  top: 80px;
  right: 20px;
  background: ${({ type }) =>
    type === "success"
      ? `linear-gradient(145deg, ${colors.successGreen}, ${colors.lightGreen})`
      : `linear-gradient(145deg, ${colors.errorRed}, ${colors.lightRed})`};
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
  animation: fadeIn 0.4s ease, fadeOut 0.4s ease 3s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export const Input = styled.input`
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  background: #f9f9f9;
  width: 100%;
  transition: border-color 0.3s ease;
  margin-bottom: 8px;

  &:focus {
    border-color: #1e88e5;
    outline: none;
  }
`;


export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  font-size: 0.9rem; /* Fonte menor */
  border-radius: 6px; /* Bordas mais suaves */
  overflow: hidden;

  thead {
    background: #f3f4f6;
  }

  th,
  td {
    padding: 8px 10px; /* Reduz espaçamento interno */
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    color: #374151;
  }

  th {
    font-weight: bold;
    font-size: 0.9rem; /* Reduz tamanho da fonte no cabeçalho */
  }

  td {
    font-size: 0.85rem; /* Fonte menor nas células */
  }

  tbody tr:hover {
    background: #f9fafb; /* Fundo mais claro no hover */
  }

  img {
    width: 40px; /* Reduz tamanho da imagem */
    height: 40px; /* Reduz tamanho da imagem */
    object-fit: cover;
    border-radius: 4px;
  }
`;

export const TableHeader = styled.th`
  background: #f5f5f5;
  color: #333333;
  padding: 10px;
  font-size: 0.9rem; /* Fonte menor */
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #dddddd;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }

  &:nth-child(odd) {
    background: #ffffff;
  }

  &:hover {
    background: #f0f0f0;
    cursor: pointer;
    transition: background 0.2s ease;
  }
`;

export const TableCell = styled.td`
  padding: 8px 10px; /* Reduz espaçamento interno */
  border-bottom: 1px solid #eeeeee;
  color: #666666;
  font-size: 0.85rem; /* Fonte menor */
  text-align: left;

  &:last-child {
    text-align: right;
  }
`;

