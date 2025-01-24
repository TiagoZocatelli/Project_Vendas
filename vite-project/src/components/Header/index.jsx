import React, { useState, useEffect } from "react";
import {
  AsideContainer,
  AsideMenu,
  AsideItem,
  DropdownMenu,
  HeaderContainer,
  HeaderTitle,
  HeaderActions,
  ProfileButton,
  LogoutButton,
  HeaderInfo,
  DateTime,
  UserGreeting,
  SettingsIcon,
  ModalContainer,
  ModalContent,
} from "./styles";

// Importando ícones
import {
  FaHome,
  FaBox,
  FaTruck,
  FaUsers,
  FaBuilding,
  FaSignInAlt,
  FaChevronDown,
  FaCog,
} from "react-icons/fa";

// Importando Link do react-router-dom
import { Link } from "react-router-dom";

const Header = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Atualiza a cada segundo

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  const toggleCadastroMenu = () => {
    setIsCadastroOpen((prev) => !prev);
  };

  return (
    <>
      {/* Menu Lateral */}
      <AsideContainer $isOpen={isAsideOpen}>
        <AsideMenu>
          <AsideItem onClick={toggleCadastroMenu}>
            <div>
              <FaBox /> Cadastro <FaChevronDown />
            </div>
            {isCadastroOpen && (
              <DropdownMenu>
                <li>
                  <Link to="/produtos">
                    <FaBox /> Produtos
                  </Link>
                </li>
                <li>
                  <Link to="/fornecedores">
                    <FaTruck /> Fornecedores
                  </Link>
                </li>
                <li>
                  <Link to="/clientes">
                    <FaUsers /> Clientes
                  </Link>
                </li>
              </DropdownMenu>
            )}
          </AsideItem>
          <AsideItem>
            <Link to="/dashboard">
              <FaHome /> Dashboard
            </Link>
          </AsideItem>
          <AsideItem>
            <Link to="/filiais">
              <FaBuilding /> Filiais
            </Link>
          </AsideItem>
          <AsideItem>
            <Link to="/entradas">
              <FaSignInAlt /> Entradas
            </Link>
          </AsideItem>
        </AsideMenu>
      </AsideContainer>

      {/* Cabeçalho */}
      <HeaderContainer $isAsideOpen={isAsideOpen}>
        <HeaderTitle>ZK SISTEMAS GERENCIAL</HeaderTitle>
        <HeaderInfo>
          {/* Exibição de Data e Hora */}
          <DateTime>{currentTime.toLocaleString()}</DateTime>

          {/* Saudações ao Usuário */}
          <UserGreeting>Bem-vindo, Zokah!</UserGreeting>

          {/* Ícones e Botões */}
          <HeaderActions>
            <SettingsIcon onClick={() => setIsSettingsModalOpen(true)}>
              <FaCog />
            </SettingsIcon>
            <ProfileButton onClick={() => setIsProfileModalOpen(true)}>
              <FaUsers /> Perfil
            </ProfileButton>
            <LogoutButton>
              <FaSignInAlt /> Sair
            </LogoutButton>
          </HeaderActions>
        </HeaderInfo>
      </HeaderContainer>

      {/* Modal de Perfil */}
      {isProfileModalOpen && (
        <ModalContainer onClick={() => setIsProfileModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Informações do Perfil</h2>
            <p>Nome: Zokah</p>
            <p>Email: Zokah@zk.com</p>
            <button onClick={() => setIsProfileModalOpen(false)}>Fechar</button>
          </ModalContent>
        </ModalContainer>
      )}

      {/* Modal de Configurações */}
      {isSettingsModalOpen && (
        <ModalContainer onClick={() => setIsSettingsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Configurações</h2>
            <p>Definições gerais do sistema</p>
            <button onClick={() => setIsSettingsModalOpen(false)}>Fechar</button>
          </ModalContent>
        </ModalContainer>
      )}
    </>
  );
};

export default Header;
