import styled from "styled-components";

export const Container = styled.div`
  margin-left: 180px;
  padding: 20px;
  min-height: 100vh;
  color: #1e293b;
  margin-top: 48px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 15px;
  }

  h1 {
    text-align: center;
    margin-bottom: 16px;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #555555;
  font-weight: bold;
`;

export const SearchBar = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 10px 15px;
  margin-bottom: 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  color: #1e293b;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }
`;

export const AddForm = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    flex-direction: column;
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  color: #1e293b;
  background: #f1f5f9;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
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