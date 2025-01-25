import styled from "styled-components";

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

export const TableContainer = styled.div`
  max-height: 400px; /* Limita a altura máxima para permitir rolagem */
  overflow-y: auto; /* Adiciona rolagem vertical */
  border: 1px solid #d1d5db; /* Borda ao redor para delimitar a tabela */
  border-radius: 10px;
  background: #ffffff;
`;