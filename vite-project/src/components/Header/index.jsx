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
  FaChartLine, // Ícone para o botão Vendas
} from "react-icons/fa";

// Importando Link do react-router-dom
import { Link } from "react-router-dom";

const Header = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(true);
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

  return (
    <>
      {/* Menu Lateral */}
      <AsideContainer $isOpen={isAsideOpen}>
        <AsideMenu>
          <AsideItem $bgColor="#E91E63" $hoverColor="#C2185B">
            <Link to="/vendas">
              <FaChartLine />
              Vendas
            </Link>
          </AsideItem>
          <AsideItem $bgColor="#FF9800" $hoverColor="#F57C00">
            <Link to="/produtos">
              <FaBox />
              Produtos
            </Link>
          </AsideItem>
          <AsideItem $bgColor="#03A9F4" $hoverColor="#0288D1">
            <Link to="/fornecedores">
              <FaTruck />
              Fornecedores
            </Link>
          </AsideItem>
          <AsideItem $bgColor="#9C27B0" $hoverColor="#7B1FA2">
            <Link to="/clientes">
              <FaUsers />
              Clientes
            </Link>
          </AsideItem>
          <AsideItem $bgColor="#F44336" $hoverColor="#D32F2F">
            <Link to="/entradas">
              <FaSignInAlt />
              Entradas
            </Link>
          </AsideItem>
          <AsideItem $bgColor="#4CAF50" $hoverColor="#388E3C">
            <Link to="/dashboard">
              <FaHome />
              Dashboard
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
            <ProfileButton>
              <Link to="/filiais">
                <FaUsers /> Filiais
              </Link>
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
            <button onClick={() => setIsSettingsModalOpen(false)}>
              Fechar
            </button>
          </ModalContent>
        </ModalContainer>
      )}
    </>
  );
};

export default Header;
