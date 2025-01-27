import styled from "styled-components";

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

export const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Permite que os inputs "quebrem" linha */
  justify-content: space-between; /* Espaçamento entre os inputs */
  gap: 20px; /* Espaçamento entre os itens */
  margin-top: 20px;
`;

export const DivHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 48%; /* Para alinhar em duas colunas */
  margin-bottom: 15px;

  label {
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #475569;
    font-weight: 500;
  }

  input {
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 3px 6px rgba(37, 99, 235, 0.2);
    }
  }
`;


export const ModalContent = styled.div`
  background: white;
  max-width: 800px; /* Tamanho máximo do modal */
  width: 90%; /* Ocupa 90% da largura da tela */
  margin: 0 auto;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

  h2 {
    color: #1e293b;
    font-size: 1.5rem;
    margin-bottom: 20px;
    font-weight: bold;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

export const ModalOverlay = styled.div`
  position: fixed; /* Fixa o overlay cobrindo toda a tela */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Fundo escuro com opacidade */
  display: flex; /* Ativa o flexbox */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  z-index: 9999; /* Garante que o modal esteja acima de outros elementos */

  animation: fadeIn 0.3s ease; /* Animação para entrada suave */

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;