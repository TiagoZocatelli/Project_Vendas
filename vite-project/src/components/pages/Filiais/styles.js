import styled from "styled-components";

export const Container = styled.div`
  margin-left: 180px; /* Espaço para o menu lateral fixo */
  padding: 20px;
  min-height: 100vh;
  color: #1e293b;
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
`;

export const ModalContent = styled.div`
  background: #ffffff; /* Cor de fundo branca */
  padding: 40px; /* Maior padding para espaçamento interno */
  border-radius: 12px; /* Bordas mais arredondadas */
  width: 100%;
  max-width: 1000px; /* Largura máxima maior */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Sombra mais suave e realista */
  max-height: 90vh; /* Altura máxima do modal */
  overflow-y: auto; /* Rola o conteúdo quando exceder a altura */
  display: flex;
  flex-direction: column; /* Alinhamento flexível interno */
  gap: 20px; /* Espaçamento entre os elementos */

  h2 {
    font-size: 1.8rem; /* Tamanho maior do título */
    font-weight: 600;
    color: #1e293b; /* Cor escura para o título */
    margin-bottom: 20px; /* Espaço inferior */
    text-align: center; /* Centralizar o título */
  }

  /* Ajustes para dispositivos móveis */
  @media (max-width: 768px) {
    max-width: 90%; /* Reduz a largura máxima em tablets */
    padding: 30px;
  }

  @media (max-width: 480px) {
    max-width: 95%; /* Reduz a largura máxima em smartphones */
    padding: 20px;
  }
`;

export const SuggestionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;

  li {
    padding: 10px;
    cursor: pointer;
    &:hover {
      background: #f1f1f1;
    }
  }
`;


export const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${({ type }) =>
    type === "success" ? "#4CAF50" : "#F44336"};
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  animation: fadeIn 0.5s ease, fadeOut 0.5s ease 2.5s;
  z-index: 1000;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
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

export const SearchBar = styled.input`
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1e293b;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const AddProductForm = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1e293b;
  background: #f9fafb;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
  margin-bottom: 8px;
  margin-top: 16px;
  margin-left: 4px;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.95);
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

export const TableContainer = styled.div`
  max-height: 400px; /* Limita a altura máxima para permitir rolagem */
  overflow-y: auto; /* Adiciona rolagem vertical */
  border: 1px solid #d1d5db; /* Borda ao redor para delimitar a tabela */
  border-radius: 10px;
  background: #ffffff;
`;