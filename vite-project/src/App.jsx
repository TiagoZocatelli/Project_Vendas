import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import GlobalStyle from "./styles/global";

// Componentes das Páginas
import Clientes from "./components/pages/Clientes";
import Produtos from "./components/pages/Produtos";
import Fornecedores from "./components/pages/Fornecedores";
import Entradas from "./components/pages/Entradas";
import Relatorios from "./components/pages/Relatorios";
import Financeiro from "./components/pages/Financeiro";
import Logout from "./components/pages/Logout";
import Filiais from "./components/pages/Filiais";
import PDV from "./components/pages/Vendas";
import LoginPDV from "./components/pages/Vendas/login";
import Cadastros from "./components/pages/cadastros";
import Operadores from "./components/pages/Operadores";
import Users from "./components/pages/LoginUser"; // 🔹 Tela de Login
import UsuariosGerenciamento from './components/pages/Usuarios';
import { ConfirmButton, ConfirmCancelButton, ConfirmModalContainer, ConfirmModalContent, ConfirmButtonContainer, BackButton } from "./styles/utils";

// 🔹 Proteção de Rotas (Exige Login)
const PrivateRouteUsers = ({ children }) => {
  const tokenUsers = localStorage.getItem("tokenUsers");
  return tokenUsers ? children : <Navigate to="/" />;
};

const PrivateRoutePdv = ({ children }) => {
  const tokenPdv = localStorage.getItem("tokenPdv");
  return tokenPdv ? children : <Navigate to="/loginPdv" />;
};

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("tokenUsers"));
  }, [location.pathname]); // Verifica o login sempre que a rota muda

  return (
    <>
      <GlobalStyle />

      {/* 🔹 Esconder Header se estiver em /vendas */}
      {location.pathname !== "/" && location.pathname !== "/loginPdv" && location.pathname !== "/vendas" && <Header />}

      <Routes>
        {/* 🔹 Tela de Login (se estiver logado, redireciona para /home) */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Users />} />

        {/* 🔹 Página de Login do PDV */}
        <Route path="/loginPdv" element={<LoginPDV />} />

        {/* 🔹 Área do sistema (Somente para usuários comuns) */}
        <Route path="/home" element={<PrivateRouteUsers><h1>Bem-vindo ao sistema</h1></PrivateRouteUsers>} />
        <Route path="/cadastros" element={<PrivateRouteUsers><Cadastros /></PrivateRouteUsers>} />
        <Route path="/cadastros/clientes" element={<PrivateRouteUsers><Clientes /></PrivateRouteUsers>} />
        <Route path="/cadastros/fornecedores" element={<PrivateRouteUsers><Fornecedores /></PrivateRouteUsers>} />
        <Route path="/cadastros/filiais" element={<PrivateRouteUsers><Filiais /></PrivateRouteUsers>} />
        <Route path="/cadastros/produtos" element={<PrivateRouteUsers><Produtos /></PrivateRouteUsers>} />
        <Route path="/cadastros/operadores" element={<PrivateRouteUsers><Operadores /></PrivateRouteUsers>} />
        <Route path="/produtos" element={<PrivateRouteUsers><Produtos /></PrivateRouteUsers>} />
        <Route path="/entradas" element={<PrivateRouteUsers><Entradas /></PrivateRouteUsers>} />
        <Route path="/relatorios" element={<PrivateRouteUsers><Relatorios /></PrivateRouteUsers>} />
        <Route path="/financeiro" element={<PrivateRouteUsers><Financeiro /></PrivateRouteUsers>} />
        <Route path="/cadastros/usuarios" element={<PrivateRouteUsers><UsuariosGerenciamento /></PrivateRouteUsers>} />

        {/* 🔹 Área do PDV (Somente para usuários do PDV) */}
        <Route path="/vendas" element={
          <PrivateRoutePdv>
            <PdvWithBackButton /> {/* 🔹 Novo Componente que exibe o botão de voltar */}
          </PrivateRoutePdv>
        } />

        {/* 🔹 Logout */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

// 🔹 Componente PDV que inclui um botão de voltar e remove o tokenPdv com confirmação
const PdvWithBackButton = () => {
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // ✅ Estado do modal de confirmação

  // 🔹 Exibe o modal antes de sair do PDV
  const handleBackToHome = () => {
    setIsConfirmModalOpen(true);
  };

  // 🔹 Confirma saída do PDV e limpa token
  const confirmBackToHome = () => {
    localStorage.removeItem("tokenPdv"); // 🔹 Remove o tokenPdv ao sair do PDV
    navigate("/home"); // 🔹 Redireciona para Home
  };

  // 🔹 Fecha o modal sem sair
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <div>
      {/* 🔹 Botão para sair do PDV com confirmação */}
      <BackButton
        onClick={handleBackToHome}
      >
        X
      </BackButton>

      {/* 🔹 Modal de Confirmação */}
      {isConfirmModalOpen && (
        <ConfirmModalContainer>
          <ConfirmModalContent>
            <h2>Confirmar saída do PDV</h2>
            <p>Tem certeza de que deseja voltar para a Home?</p>
            <ConfirmButtonContainer>
              <ConfirmButton onClick={confirmBackToHome}>Sim, Voltar</ConfirmButton>
              <ConfirmCancelButton onClick={closeConfirmModal}>Cancelar</ConfirmCancelButton>
            </ConfirmButtonContainer>
          </ConfirmModalContent>
        </ConfirmModalContainer>
      )}

      {/* 🔹 Componente PDV */}
      <PDV />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
