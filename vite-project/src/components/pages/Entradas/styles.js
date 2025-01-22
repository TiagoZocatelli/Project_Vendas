import styled from "styled-components";

export const Container = styled.div`
  margin-left: 300px;
  padding: 20px;
  background: #f3f4f6;
  min-height: 100vh;
  color: #1e293b;
  
  h1 {
    margin: 8px;
  }
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

  button {
    margin-top: 20px;
    width: 100%;
    max-width: 250px; /* Botões maiores */
    padding: 12px 20px; /* Mais espaçamento nos botões */
    font-size: 1rem;
    font-weight: 500;
    color: #ffffff;
    background-color: #2563eb; /* Cor azul */
    border: none;
    border-radius: 8px; /* Bordas arredondadas */
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      background-color: #1d4ed8;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
      background-color: #1e40af;
    }
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
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 10px; /* Dá um espaço entre o campo de pesquisa e a lista */

  li {
    padding: 10px 15px;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }

  /* Ajuste para dispositivos móveis */
  @media (max-width: 600px) {
    max-height: 150px;
  }
`;

// Container para o Dropdown
export const Dropdown = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  top: 100%;
  left: 0;
`;

// Itens dentro do Dropdown
export const DropdownItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: #007bff;
  }

  &:active {
    background-color: #007bff;
    color: white;
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
export const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

export const AddForm = styled.div`
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
  background: #2563eb;
  margin: 2px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background: #1e40af;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

export const TableHeader = styled.th`
  background: #1e293b;
  color: #ffffff;
  text-align: left;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f9fafb;
  }

  &:hover {
    background: #e2e8f0;
  }
`;

export const TableCell = styled.td`
  padding: 15px;
  font-size: 0.9rem;
  color: #1e293b;
  border-bottom: 1px solid #d1d5db;
  text-align: left;
`;
