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
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Usuário"); // 🔹 Pega nome do usuário

  const navigate = useNavigate();

  const handleVendasClick = () => {
    const token = localStorage.getItem("tokenPdv");
    if (token) {
      navigate("/vendas");
    } else {
      navigate("/loginPdv");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Atualiza a cada segundo

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem("tokenUsers");
    localStorage.removeItem("tokenPdv");
    localStorage.removeItem("userName"); // 🔹 Remove o nome ao deslogar
    navigate("/");
  };

  return (
    <>
      {/* Menu Lateral */}
      <AsideContainer $isOpen={isAsideOpen}>
        <AsideMenu>
          <AsideItem $bgColor="#E91E63" $hoverColor="#C2185B" onClick={handleVendasClick}>
            <Link to="/vendas">
              <FaChartLine />
              PDV
            </Link>
          </AsideItem>
          <AsideItem $bgColor="#3F51B5" $hoverColor="#303F9F"> {/* Novo botão de Pedidos */}
            <Link to="/pedidos">
              <FaTruck />
              Pedidos
            </Link>
          </AsideItem>
          <AsideItem $bgColor="#FF9800" $hoverColor="#F57C00">
            <Link to="/cadastros">
              <FaBox />
              Cadastros
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
          <UserGreeting>Bem-vindo, {userName} !</UserGreeting>

          {/* Ícones e Botões */}
          <HeaderActions>
            <SettingsIcon onClick={() => setIsSettingsModalOpen(true)}>
              <FaCog />
            </SettingsIcon>
            <LogoutButton onClick={confirmLogout}>
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
