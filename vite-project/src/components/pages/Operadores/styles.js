import styled from "styled-components";

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

export const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  gap: 10px;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color:rgb(65, 24, 230);
  color: white;
  margin-bottom: 16px;

  &:hover {
    background-color: #218838;
  }
`;

export const Table = styled.table`
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
`;

export const TableHeader = styled.th`
  background: #007bff;
  color: white;
  padding: 10px;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f2f2f2;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
  text-align: center;
`;

export const DeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
  margin-left: 5px;

  &:hover {
    background-color: #c82333;
  }
`;


export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Fundo escuro mais suave */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  width: 90%;
  max-width: 450px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  color: #1e1e1e;
  margin-bottom: 15px;
`;

export const ModalText = styled.p`
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 20px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

export const ConfirmButton = styled.button`
  background: #28a745; /* Verde */
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #218838;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const CancelButton = styled.button`
  background: #dc3545; /* Vermelho */
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #c82333;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const CloseIcon = styled.span`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 22px;
  cursor: pointer;
  color: #555;
  transition: 0.3s;

  &:hover {
    color: #c82333;
  }
`;
export const EditButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffc107;
  color: black;

  &:hover {
    background-color: #e0a800;
  }
`;
