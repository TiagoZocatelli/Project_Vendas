import styled from "styled-components";


export const LeftButton = styled.div`
  position: fixed;
  top: 12px;
  left: 15px;
  width: 40px;
  height: 40px;
  background:rgb(158, 11, 11);
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
  color: #333333; /* Texto em cinza escuro */

  h1 {
    text-align: center;
    margin-bottom: 16px;
  }
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


export const Button = styled.button`
  background-color: #0056b3;
  color: #ffffff;
  font-size: 0.8rem; /* Reduz tamanho da fonte */
  font-weight: 600;
  padding: 6px 12px; /* Reduz padding */
  border: none;
  border-radius: 6px; /* Bordas mais suaves */
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
      ? "linear-gradient(145deg, #4caf50, #81c784)" /* Gradiente verde */
      : "linear-gradient(145deg, #ff6347, #ff867f)"}; /* Gradiente vermelho */
  color: #ffffff;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  font-weight: bold;
  z-index: 999999;
  display: flex;
  align-items: center; /* Alinha o ícone e o texto */
  gap: 10px; /* Espaçamento entre ícone e texto */
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

