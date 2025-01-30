import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import { IconButton } from "./components/pages/Vendas/styles";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LeftButton } from "./styles/utils";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <>
      <GlobalStyle />
      {location.pathname !== "/vendas" && <Header />}
      {location.pathname === "/vendas" && (
        <LeftButton onClick={() => navigate(-1)} style={{ margin: "10px" }}>
          <FaArrowLeft /> 
        </LeftButton>
      )}
      <Routes>
        <Route path="/" element={<h1>Bem-vindo ao sistema</h1>} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/filiais" element={<Filiais />} />
        <Route path="/vendas" element={<PDV />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/entradas" element={<Entradas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/financeiro" element={<Financeiro />} />
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
