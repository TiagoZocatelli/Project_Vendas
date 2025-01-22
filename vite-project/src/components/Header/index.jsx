import { useState } from "react";
import {
  Aside,
  AsideMenu,
  AsideItem,
  DropdownMenu,
  DropdownItem,
  ToggleButton,
  MainContent,
} from "./styles";
import {
  FaUsers,
  FaBox,
  FaTruck,
  FaSignInAlt,
  FaClipboardList,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaChartPie,
  FaFileAlt,
} from "react-icons/fa";

import { Link, Outlet } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <ToggleButton onClick={toggleMenu}>{isMenuOpen ? "❮" : "❯"}</ToggleButton>

      <Aside $isOpen={isMenuOpen}>
        <AsideMenu>
          <AsideItem>
            <Link to="/produtos">
              <FaBox /> Produtos
            </Link>
          </AsideItem>
          <AsideItem>
            <Link to="/clientes">
              <FaUsers /> Clientes
            </Link>
          </AsideItem>
          <AsideItem>
            <Link to="/fornecedores">
              <FaTruck /> Fornecedores
            </Link>
          </AsideItem>
          <AsideItem>
            <Link to="/entradas">
              <FaSignInAlt /> Entradas
            </Link>
          </AsideItem>
          <AsideItem>
            <div>
              <FaClipboardList /> Relatórios
            </div>
            <DropdownMenu>
              <DropdownItem>
                <Link to="/relatorios/vendas">
                  <FaChartPie /> Vendas
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/relatorios/financeiro">
                  <FaMoneyBillWave /> Financeiro
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/relatorios/estoque">
                  <FaFileAlt /> Estoque
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </AsideItem>
          <AsideItem>
            <Link to="/logout">
              <FaSignOutAlt /> Logout
            </Link>
          </AsideItem>
          <AsideItem>
            <Link to="/filiais">
              <FaSignOutAlt /> Filiais
            </Link>
          </AsideItem>
        </AsideMenu>
      </Aside>

      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
};

export default Header;
