import styled from "styled-components";

export const Container = styled.div`
  margin-left: 300px; /* Espaço para o menu lateral fixo */
  padding: 20px;
  background: #f3f4f6;
  min-height: 100vh;
  color: #1e293b;
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
  table-layout: auto; /* Permite que as colunas se ajustem ao conteúdo */
`;

export const TableHeader = styled.th`
  background: #1e293b;
  color: #ffffff;
  text-align: left;
  padding: 10px; /* Reduzi o padding */
  font-size: 0.85rem; /* Tamanho da fonte reduzido */
  font-weight: 600;
  position: sticky; /* Mantém o cabeçalho fixo ao rolar */
  top: 0;
  z-index: 1;
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
  padding: 8px; /* Reduzi o padding para otimizar espaço */
  font-size: 0.85rem; /* Fonte menor para mais conteúdo visível */
  color: #1e293b;
  border-bottom: 1px solid #d1d5db;
  text-align: left;

  /* Limita o texto em excesso com reticências */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TableContainer = styled.div`
  max-height: 400px; /* Limita a altura máxima para permitir rolagem */
  overflow-y: auto; /* Adiciona rolagem vertical */
  border: 1px solid #d1d5db; /* Borda ao redor para delimitar a tabela */
  border-radius: 10px;
  background: #ffffff;
`;