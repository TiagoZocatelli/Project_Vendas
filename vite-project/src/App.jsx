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
import UsuariosGerenciamento from './components/pages/Usuarios'

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

      {/* 🔹 Renderiza o Header em todas as páginas, exceto Login e LoginPDV */}
      {location.pathname !== "/" && location.pathname !== "/loginPdv" && <Header />}

      <Routes>
        {/* 🔹 Tela de Login (se estiver logado, redireciona para /home) */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Users />} />

        {/* 🔹 Página de Login do PDV, acessada apenas ao tentar entrar no PDV */}
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
        <Route path="/cadastros/usuarios" element={<PrivateRouteUsers><UsuariosGerenciamento /> </PrivateRouteUsers>} />


        {/* 🔹 Área do PDV (Somente para usuários do PDV) */}
        <Route path="/vendas" element={<PrivateRoutePdv><PDV /></PrivateRoutePdv>} />

        {/* 🔹 Logout */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
