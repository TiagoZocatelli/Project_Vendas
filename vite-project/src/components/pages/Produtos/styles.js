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



export const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input[type="file"] {
    margin: 10px 0;
    border: 2px solid #cccccc; /* Cinza claro */
    border-radius: 8px;
    padding: 8px;
    background: #ffffff; /* Fundo branco */
    color: #333333; /* Texto em cinza escuro */
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #aaaaaa; /* Cinza médio no foco */
    }
  }

  span {
    font-size: 12px;
    color: #666666; /* Texto em cinza */
  }
`;

export const SuggestionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  background: #ffffff; /* Fundo branco */
  border: 2px solid #dddddd; /* Cinza claro */
  border-radius: 8px;

  li {
    padding: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #333333; /* Texto em cinza escuro */
    transition: background 0.3s ease, transform 0.2s ease;

    &:hover {
      background: #f5f5f5; /* Cinza bem claro no hover */
      transform: translateX(5px);
    }
  }
`;

export const Notification = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: ${({ type }) =>
    type === "success"
      ? "linear-gradient(145deg, #4caf50, #81c784)" /* Gradiente verde */
      : "linear-gradient(145deg, #ff6347, #ff867f)"}; /* Gradiente vermelho */
  color: #ffffff;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  font-weight: bold;
  z-index: 1000;
  display: flex;
  align-items: center; /* Alinha o ícone e o texto */
  gap: 10px; /* Espaçamento entre ícone e texto */
  animation: fadeIn 0.4s ease, fadeOut 0.4s ease 3s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-15px);
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


export const SearchContainer = styled.div`
  display: flex;
  align-items: center; /* Alinha verticalmente ao centro */
  gap: 10px; /* Espaço entre os elementos */
  margin-bottom: 20px;
`;

export const SearchBar = styled.input`
  flex: 1; /* Faz o input ocupar o espaço restante */
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  background: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1e88e5;
    outline: none;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #555555;
  font-weight: bold;
`;

export const Select = styled.select`
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  background: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1e88e5;
    outline: none;
  }
`;


export const Input = styled.input`
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  background: #f9f9f9;
  width: 100%;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1e88e5;
    outline: none;
  }
`;

export const ModalButton = styled.button`
  background-color: #0056b3;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-transform: uppercase; /* Letras maiúsculas */
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  flex: 1; /* Faz o botão preencher o espaço disponível */
  max-width: 250px; /* Limita a largura máxima */
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px) scale(1.02); /* Efeito de elevação leve */
  }

  &:active {
    transform: translateY(2px) scale(0.98); /* Sutil efeito de pressionado */
  }
`;

export const RemoveImageButton = styled(ModalButton)`
  background: linear-gradient(145deg, #ff6347, #e53935); /* Gradiente vermelho */
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Espaça uniformemente os botões */
  gap: 20px; /* Espaçamento entre os botões */
  margin-top: 20px; /* Espaço superior */
  width: 100%; /* Preenche o contêiner */
  align-items: center;

  ${ModalButton}, ${RemoveImageButton} {
    flex: 1; /* Faz com que os botões tenham o mesmo tamanho */
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


export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Fundo mais escuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px; /* Espaçamento para bordas */

  h3 {
    margin-top: 16px;
    margin-bottom: 16px;
  }
`;


export const DivCategory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const ModalContent = styled.div`
  display: flex; /* Ativa o flexbox */
  flex-direction: column; /* Itens empilhados verticalmente */
  justify-content: flex-start; /* Alinha os itens no início */
  align-items: stretch; /* Permite que o botão siga a largura dos filhos */
  background: #ffffff;
  padding: 70px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Sombra */
  width: 100%;
  max-width: 1500px;
  position: relative; /* Não mais necessário absoluto */
`;


export const Textarea = styled.textarea`
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  background: #f9f9f9;
  width: 100%; /* Usa toda a largura disponível */
  height: 60px; /* Altura reduzida para um formato mais retangular */
  resize: none; /* Remove o redimensionamento para manter o layout */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #1e88e5; /* Azul no foco */
    outline: none;
    box-shadow: 0 0 10px rgba(30, 136, 229, 0.3); /* Realce */
  }
`;

export const AddProductForm = styled.form`
  display: flex;
  flex-wrap: wrap; /* Permite quebra de linha para campos */
  gap: 20px;

  label {
    font-weight: bold;
    font-size: 1rem;
    color: #555555;
  }

  /* Campos dentro do formulário */
  ${Input}, ${Textarea} {
    flex: 1 1 48%; /* 48% da largura para criar um layout lado a lado */
    min-width: 250px; /* Largura mínima para campos */
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
  right: 5px; /* Distância da direita */
  padding: 5px 10px; /* Espaçamento interno */
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



export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;

  input[type="file"] {
    border: 2px solid #1e88e5;
    border-radius: 8px;
    padding: 10px;
    width: 100%;
  }

  img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border: 2px solid #1e88e5;
    border-radius: 8px;
  }
`;

export const ImagePreview = styled.img`
  width: 120px; /* Tamanho ajustado para visualização */
  height: 120px;
  object-fit: cover; /* Imagem ajustada para caber no contêiner */
  border-radius: 10px;
  border: 2px solid #1e88e5; /* Azul escuro para borda */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1); /* Leve zoom no hover */
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.5); /* Sombra azul */
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