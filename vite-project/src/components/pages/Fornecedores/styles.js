import styled from "styled-components";

export const Container = styled.div`
  margin-left: 300px;
  padding: 20px;
  background: #f9fafb;
  min-height: 100vh;
  color: #1e293b;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 15px;
  }
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
  background: #3b82f6;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background: #1d4ed8;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const TableHeader = styled.th`
  background: #1e293b;
  color: #ffffff;
  text-align: left;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f1f5f9;
  }

  &:hover {
    background: #e2e8f0;
  }
`;

export const TableCell = styled.td`
  padding: 15px;
  font-size: 0.9rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.85rem;
  }
`;
