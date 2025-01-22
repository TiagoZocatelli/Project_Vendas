import styled from "styled-components";

export const Aside = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isOpen ? "0" : "-300px")}; /* Colapsa o menu lateral */
  width: 300px;
  height: 100vh;
  background: linear-gradient(145deg, #1e3a5f, #243b55); /* Gradiente moderno */
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3); /* Sombra aprimorada */
  z-index: 1000;
  transition: left 0.3s ease;
  border-radius: 1px;
  @media (max-width: 768px) {
    width: 250px;
  }
`;

export const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: ${(props) => (props.$isOpen ? "300px" : "20px")};
  background: #243b55;
  color: #ffffff;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  z-index: 1100;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: #1d4ed8; /* Azul vibrante no hover */
    color: #f1f5f9; /* Texto claro */
    transform: rotate(180deg); /* Animação de rotação */
  }
`;

export const AsideMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DropdownMenu = styled.div`
  margin-top: 10px;
  padding-left: 20px;
  padding: 16px;
  position: absolute; /* Garante que o menu flutue */
  top: 100%;
  left: 0;
  background: #1f2937; /* Fundo escuro elegante */
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3); /* Sombra suave */
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;

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
`;

export const DropdownItem = styled.div`
  padding: 12px 20px;
  border-radius: 6px; /* Bordas arredondadas mais suaves */
  background: transparent; /* Fundo transparente por padrão */
  font-size: 1rem;
  font-weight: 500;
  color: #d1d5db; /* Cor do texto inicial */
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  a {
    text-decoration: none;
    color: inherit; /* Herda a cor do pai */
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%; /* Ocupa toda a largura */
  }

  &:hover {
    background: #2563eb; /* Fundo azul no hover */
    color: #ffffff; /* Texto branco no hover */
    transform: translateX(5px); /* Leve movimento lateral */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para profundidade */
  }

  &:active {
    background: #1d4ed8; /* Azul mais escuro no clique */
    color: #f1f5f9; /* Texto claro no clique */
    transform: translateX(0); /* Remove o deslocamento no clique */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Sombra reduzida no clique */
  }
`;


export const AsideItem = styled.li`
  position: relative; /* Necessário para o DropdownMenu */
  width: 100%;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;

  a,
  div {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: "Roboto", sans-serif;
  }

  &:hover > ${DropdownMenu} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #38bdf8;
  }
`;



export const MainContent = styled.main`
  margin-left: 300px;
  padding: 30px;
  flex: 1;
  background: #f8fafc; /* Fundo claro */
  color: #1e293b;
  overflow-y: auto;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 250px;
  }
`;
