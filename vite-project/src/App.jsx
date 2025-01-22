import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GlobalStyle from "./styles/global";

// Componentes das Páginas
import Clientes from "./components/pages/Clientes";
import Produtos from "./components/pages/Produtos";
import Fornecedores from "./components/pages/Fornecedores";
import Entradas from "./components/pages/Entradas";
import Relatorios from "./components/pages/Relatorios";
import Financeiro from "./components/pages/Financeiro";
import Logout from "./components/pages/Logout" 

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<h1>Bem-vindo ao sistema</h1>} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/entradas" element={<Entradas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
