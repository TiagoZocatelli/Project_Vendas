import styled from "styled-components";

export const Container = styled.div`
 margin-left: 260px;
  padding: 20px;
  color: #1e293b;
  
  h1 {
    margin-top: 48px;
    text-align: center;
  }
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  box-sizing: border-box;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 1800px; /* Largura maior para comportar os dois lados */
  max-height: 100vh;
  height: 700px;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  display: flex; /* Torna o conteúdo flexível */
  gap: 20px;

  h2 {
    font-size: 1.8rem;
    font-weight: bold;
    color: #1e293b;
    text-align: center;
    margin-bottom: 20px;
  }
`;
export const CloseButton = styled.button`
  background-color: #e53935; /* Vermelho vibrante */
  border: none; /* Sem borda */
  font-size: 20px; /* Tamanho do ícone */
  color: #ffffff; /* Texto branco */
  cursor: pointer;
  position: absolute;
  top: 5px;
  padding: 10px 15px; /* Espaçamento interno */
  border-radius: 50%; /* Botão arredondado */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Sombra para profundidade */
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff6347; /* Vermelho mais claro no hover */
    transform: scale(1.1); /* Leve aumento no hover */
    box-shadow: 0 8px 16px rgba(255, 99, 71, 0.5); /* Sombra vibrante no hover */
  }

  &:active {
    background-color: #c62828; /* Vermelho mais escuro ao clicar */
    transform: scale(0.95); /* Leve redução ao clicar */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Sombra menor ao clicar */
  }

  &:focus {
    outline: none; /* Remove o contorno padrão */
    box-shadow: 0 0 10px rgba(229, 57, 53, 0.8); /* Sombra de foco */
  }
`;


export const AddFormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative; /* Necessário para que o SuggestionsList funcione corretamente */
`;

export const TableContainer = styled.div`
  flex: 1; /* A tabela ocupa 1 parte do espaço */
  overflow-y: auto; /* Permite rolagem caso a tabela seja muito grande */
  max-height: 80vh; /* Limita a altura máxima da tabela */
  padding: 10px;
  background: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

export const SuggestionsList = styled.ul`
  position: absolute; /* Torna a lista independente do fluxo do layout */
  top: 35%; /* Garante que ela apareça logo abaixo do input */
  left: 20%; /* Alinha à esquerda do input */
  list-style: none; /* Remove os marcadores da lista */
  margin: 0; /* Remove as margens padrão */
  padding: 0; /* Remove o espaçamento interno */
  max-height: 240px; /* Limita a altura da lista */
  overflow-y: auto; /* Adiciona rolagem vertical se necessário */
  background: #f9fafb; /* Fundo cinza claro */
  border-radius: 6px; /* Bordas arredondadas para suavidade */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra para profundidade */
  width: 100%; /* Garante que a largura se ajuste ao input */
  z-index: 1000; /* Garante que a lista esteja acima de outros elementos */

  li {
    padding: 10px 16px; /* Espaçamento interno para itens */
    font-size: 1rem; /* Tamanho consistente da fonte */
    color: #374151; /* Cor do texto */
    cursor: pointer; /* Indica interatividade */
    display: flex; /* Garante flexibilidade para conteúdos adicionais */
    align-items: center; /* Centraliza o conteúdo verticalmente */
    transition: background-color 0.3s ease, color 0.3s ease; /* Suaviza transições */

    &:hover {
      background: #edf2f7; /* Fundo claro no hover */
      color: #1a73e8; /* Azul vibrante no hover */
    }

    &:not(:last-child) {
      border-bottom: 1px solid #e2e8f0; /* Linha divisória entre itens */
    }
  }

  /* Ajustes para conteúdo adicional (ícones, imagens) */
  img {
    width: 32px; /* Tamanho padrão da imagem */
    height: 32px; /* Proporção quadrada */
    object-fit: cover; /* Garante que a imagem não seja distorcida */
    border-radius: 4px; /* Bordas arredondadas para suavidade */
    margin-right: 12px; /* Espaço entre a imagem e o texto */
  }
`;



export const Input = styled.input`
  width: 100%; /* Garante que o input ocupe todo o espaço permitido */
  padding: 12px 15px; /* Espaçamento interno */
  border: 1px solid #d1d5db; /* Borda padrão */
  border-radius: 8px; /* Bordas arredondadas */
  font-size: 1rem; /* Tamanho da fonte */
  color: #1e293b; /* Texto escuro */
  background: #f9fafb; /* Fundo claro */
  transition: all 0.3s ease; /* Suaviza transições no hover e foco */

  &:focus {
    border-color: #2563eb; /* Azul vibrante no foco */
    outline: none; /* Remove o contorno padrão */
    box-shadow: 0 0 8px rgba(37, 99, 235, 0.4); /* Sombra no foco */
  }
`;
export const SelectedProductContainer = styled.div`
  display: flex;
  align-items: center; /* Centraliza o conteúdo verticalmente */
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px; /* Bordas mais suaves */
  background-color: #f9fafb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Sombra mais leve */
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h4 {
    margin: 0;
    font-size: 1rem; /* Fonte menor */
    font-weight: bold;
    color: #374151;
  }

  p {
    margin: 2px 0; /* Reduz margens */
    font-size: 0.9rem; /* Fonte menor */
    color: #4b5563;

    strong {
      color: #1f2937;
    }
  }
`;

export const ProductImage = styled.img`
  width: 70px; /* Reduz largura */
  height: 70px; /* Reduz altura */
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Sombra mais leve */
  border: 1px solid #e5e7eb;
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

export const ItemsModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); /* Fundo escuro com transparência */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px; /* Espaçamento interno para evitar cortes na tela */
`;

export const ItemsModalContent = styled.div`
  background: #ffffff; /* Fundo branco */
  width: 90%; /* Usa 90% da largura da tela */
  max-width: 800px; /* Largura máxima */
  border-radius: 12px; /* Bordas arredondadas */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); /* Sombra */
  padding: 20px;
  max-height: 80vh; /* Altura máxima do modal */
  overflow-y: auto; /* Adiciona rolagem vertical */
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espaçamento entre os elementos */

  h2 {
    font-size: 1.5rem; /* Tamanho do título */
    text-align: center;
    color: #1f2937; /* Texto escuro */
    margin-bottom: 10px;
  }
`;

export const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #f9fafb; /* Fundo claro */
  border-radius: 8px;
  overflow: hidden;

  thead {
    background-color: #e5e7eb; /* Fundo do cabeçalho */
  }

  th,
  td {
    text-align: left;
    padding: 12px 15px; /* Espaçamento interno */
    border-bottom: 1px solid #d1d5db; /* Linha divisória */
    font-size: 0.9rem;
    color: #4b5563; /* Texto mais escuro */
  }

  th {
    font-weight: bold;
    color: #1f2937; /* Texto mais forte no cabeçalho */
  }

  tbody tr:hover {
    background-color: #f3f4f6; /* Fundo no hover */
  }
`;

export const CloseModalButton = styled.button`
  background-color: #e63946; /* Vermelho */
  color: #ffffff; /* Texto branco */
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  align-self: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d62828; /* Tom mais escuro no hover */
  }

  &:active {
    background-color: #c81c1c; /* Tom mais escuro ao pressionar */
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