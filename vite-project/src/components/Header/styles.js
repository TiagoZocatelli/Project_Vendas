import styled from "styled-components";
import { colors } from "../../styles/colors";

export const AsideContainer = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isOpen ? "0" : "-260px")};
  width: 260px;
  height: 100vh;
  background: linear-gradient(145deg, ${colors.primaryBlue}, ${colors.secondaryBlue});
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: left 0.3s ease;
`;

export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;



export const AsideMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espaçamento maior entre os itens */
`;

export const BigButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background: ${(props) => props.bgColor || colors.secondaryBlue};
  color: ${(props) => props.color || colors.white};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, background 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: ${(props) => props.hoverColor || colors.darkBlue};
  }

  svg {
    font-size: 2rem;
    margin-bottom: 8px;
  }
`;

export const AsideItem = styled.li`
  display: flex;
  justify-content: flex-start; /* Alinha o conteúdo à esquerda */
  align-items: center; /* Centraliza verticalmente ícone e texto */
  width: 100%;
  height: 90px; /* Altura consistente para todos os itens */
  padding: 0 20px; /* Espaçamento interno */
  background: ${(props) => props.$bgColor || "#0056b3"};
  color: ${(props) => props.color || "#ffffff"};
  font-size: 1rem; /* Tamanho do texto */
  font-weight: bold;
  border-radius: 16px; /* Bordas arredondadas */
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${(props) => props.$hoverColor || "#003d80"};
    transform: translateY(-5px); /* Eleva levemente no hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Aumenta a sombra no hover */
  }

  svg {
    font-size: 3rem; /* Tamanho fixo do ícone */
    flex-shrink: 0; /* Evita que o ícone seja redimensionado */
    margin-right: 16px; /* Espaçamento entre ícone e texto */
  }

  a {
    text-decoration: none;
    color: inherit; /* Herda a cor do item */
    display: flex;
    align-items: center; /* Centraliza o texto com o ícone */
    gap: 10px; /* Espaçamento entre ícone e texto */
    width: 100%;
    overflow: hidden; /* Garante que o texto muito longo não quebre */
    text-overflow: ellipsis; /* Adiciona reticências ao texto muito longo */
    white-space: nowrap; /* Evita quebra de linha */
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0px;
  width: 100%;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  z-index: 10;

  a {
    padding: 10px 15px;
    text-decoration: none;
    color: black;
    font-size: 14px;
    transition: background 0.3s;

    &:hover {
      background: #f0f0f0;
    }
  }
`;

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isAsideOpen ? "260px" : "0")};
  width: calc(100% - ${(props) => (props.$isAsideOpen ? "180px" : "0")});
  height: 60px;
  background: linear-gradient(145deg, #102c57, #0056b3);
  color: #ffffff; /* Texto branco */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 100px;
  z-index: 1001;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: left 0.3s ease, width 0.3s ease;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase; /* Letras maiúsculas para destaque */
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px; /* Espaço entre itens */
`;

export const DateTime = styled.span`
  font-size: 1rem;
  color: #9ca3af; /* Cinza suave */
`;

export const UserGreeting = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff; /* Texto branco para contraste */
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* Espaço entre botões */
`;

export const SettingsIcon = styled.div`
  font-size: 1.3rem;
  cursor: pointer;
  color: #9ca3af; /* Cinza suave */
  transition: color 0.3s ease;

  &:hover {
    color: #e0e0e0; /* Cinza mais claro no hover */
  }
`;

export const ProfileButton = styled.button`
  background: ${(props) => props.bgColor || "#FF9800"}; /* Cor de fundo padrão */
  color: ${(props) => props.color || "#ffffff"}; /* Texto branco */
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 16px; /* Espaçamento interno */
  border: none;
  border-radius: 6px; /* Bordas arredondadas */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px; /* Espaçamento entre ícone e texto */
  transition: background 0.3s ease, transform 0.2s ease;

  &:active {
    transform: scale(0.95); /* Leve redução no clique */
  }
`;


export const LogoutButton = styled(ProfileButton)`
  background: #dc2626; /* Vermelho para botão de logout */
  color: #ffffff;

  &:hover {
    background: #b91c1c; /* Vermelho mais escuro no hover */
  }
`;


export const NotificationIcon = styled.div`
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1e88e5;

  span {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff6347;
    color: #ffffff;
    font-size: 0.8rem;
    padding: 3px 6px;
    border-radius: 50%;
  }
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Fundo semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #ffffff; /* Fundo branco */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Sombra suave */
  width: 90%;
  max-width: 500px; /* Limita a largura */
  max-height: 80vh; /* Limita a altura */
  overflow-y: auto; /* Adiciona rolagem se o conteúdo ultrapassar a altura */
  position: relative; /* Para o botão fechar ficar dentro do modal */

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333333;
  }

  p {
    font-size: 1rem;
    margin-bottom: 15px;
    color: #555555;
  }

  button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #1e88e5;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #1565c0;
    }

    &:active {
      background-color: #0d47a1;
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #333333;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6347; /* Vermelho no hover */
  }
`;
