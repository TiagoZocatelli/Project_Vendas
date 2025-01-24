import styled from "styled-components";

export const AsideContainer = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isOpen ? "0" : "-240px")};
  width: 180px;
  height: 100vh;
  background: linear-gradient(145deg, #102c57, #0056b3);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: left 0.3s ease;
`;

export const AsideMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const AsideItem = styled.li`
  position: relative;
  a,
  div {
    text-decoration: none;
    color: #e3f2ff;
    font-weight: 600;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease, color 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #40bdf5;
  }

  svg {
    font-size: 1.2rem;
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 130px;
  background: linear-gradient(145deg, #102c57, #0056b3);
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Sombra sólida */
  padding: 10px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li a {
    text-decoration: none;
    color: #ffffff; /* Branco para texto */
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    transition: background 0.3s ease, transform 0.2s ease;

    &:hover {
      background: #0056b3; /* Azul escuro sólido no hover */
      color: #ffffff; /* Mantém o texto branco */
      transform: scale(1.05); /* Leve aumento */
      box-shadow: 0 4px 8px #0056b3; /* Realce no hover */
    }
  }
`;



export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isAsideOpen ? "180px" : "0")};
  width: calc(100% - ${(props) => (props.$isAsideOpen ? "180px" : "0")});
  height: 60px;
  background: linear-gradient(145deg, #102c57, #0056b3);
  color: #ffffff; /* Texto branco */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
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
  background: #0056b3; /* Fundo cinza escuro */
  color: #ffffff; /* Texto branco */
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
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
