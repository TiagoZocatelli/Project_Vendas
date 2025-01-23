import styled from "styled-components";

export const Aside = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isOpen ? "0" : "-240px")}; /* Colapsa o menu lateral */
  width: 240px;
  height: 100vh;
  background: linear-gradient(145deg, #1e3a5f, #243b55); /* Gradiente moderno */
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2); /* Sombra mais sutil */
  z-index: 1000;
  transition: left 0.3s ease;
  border-radius: 0;
  @media (max-width: 768px) {
    width: 200px;
  }
`;

export const ToggleButton = styled.button`
  position: fixed;
  top: 15px;
  left: ${(props) => (props.$isOpen ? "240px" : "15px")};
  background: #243b55;
  color: #ffffff;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1100;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Sombra sutil */
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
  gap: 15px;
`;

export const DropdownMenu = styled.div`
  margin-top: 5px;
  padding: 12px;
  position: absolute;
  top: 100%;
  left: 0;
  background: linear-gradient(145deg, #1e293b, #2d3748); /* Gradiente para um visual moderno */
  border-radius: 12px; /* Bordas mais arredondadas */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25); /* Sombra aprimorada */
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;

  &:hover {
    opacity: 1; /* Garante que o hover mantenha o menu visível */
    visibility: visible;
  }

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent; /* Triângulo para indicar a seta */
    border-right: 8px solid transparent;
    border-bottom: 8px solid #1e293b; /* Cor do fundo do menu */
  }
`;


export const DropdownItem = styled.div`
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #d1d5db;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  &:hover {
    background: #2563eb;
    color: #ffffff;
    transform: translateX(3px); /* Movimento mais leve */
  }

  &:active {
    background: #1d4ed8;
    color: #f1f5f9;
    transform: translateX(0);
  }
`;

export const AsideItem = styled.li`
  position: relative;
  width: 100%;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  a,
  div {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: "Roboto", sans-serif;
  }

  &:hover > ${DropdownMenu} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #38bdf8;
  }
`;

export const MainContent = styled.main`
  margin-left: 240px;
  padding: 20px;
  flex: 1;
  background: #f8fafc;
  color: #1e293b;
  overflow-y: auto;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 200px;
  }
`;
