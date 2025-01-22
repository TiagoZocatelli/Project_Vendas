import styled from "styled-components";

export const Container = styled.div`
  margin-left: 300px; /* Espaço para o menu lateral fixo */
  padding: 20px;
  background: #f3f4f6;
  min-height: 100vh;
  color: #1e293b;
`;

export const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input[type="file"] {
    margin: 10px 0;
  }

  span {
    font-size: 12px;
    color: #666;
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

// Container da imagem
export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border: 2px dashed #3498db;
  border-radius: 10px;
  background-color: #f0f8ff;
`;


// Estilo da imagem
export const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;
export const AddProductForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
// Estilo para os inputs
export const Input = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
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
  margin-bottom: 8px;

  &:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background: #1e40af;
  }
`;

// Botão de remover imagem
export const RemoveImageButton = styled(Button)`
  background-color: #e74c3c;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;


// Modal Container
export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); /* Cor mais suave para o fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

// Modal Content
export const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 30px;
  width: 90%;
  max-width: 650px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: fadeIn 0.4s ease;
  max-height: 90vh;  /* Para manter o modal dentro da tela */
  overflow-y: auto;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Modal Close Button
export const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 28px;
  color: #333;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  transition: transform 0.3s ease;

  &:hover {
    color: #ff6347; /* Cor mais viva quando passar o mouse */
    transform: scale(1.2); /* Um efeito de escala suave */
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