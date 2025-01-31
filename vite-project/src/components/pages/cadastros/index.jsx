import React from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaUsers, FaTruck, FaBuilding, FaBox, FaUserTie, 
    FaUserShield, FaCreditCard 
} from "react-icons/fa";
import { Container, Title, ButtonContainer, Button } from "./styles";

const Cadastros = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Title>Gerenciamento de Cadastros</Title>
            <ButtonContainer>
                <Button color="#FF9800" onClick={() => navigate("/cadastros/clientes")}>
                    <FaUsers /> Clientes
                </Button>
                <Button color="#4CAF50" onClick={() => navigate("/cadastros/fornecedores")}>
                    <FaTruck /> Fornecedores
                </Button>
                <Button color="#2196F3" onClick={() => navigate("/cadastros/filiais")}>
                    <FaBuilding /> Filiais
                </Button>
                <Button color="#673AB7" onClick={() => navigate("/cadastros/produtos")}>
                    <FaBox /> Produtos
                </Button>
                <Button color="#3F51B5" onClick={() => navigate("/cadastros/operadores")}>
                    <FaUserTie /> Operadores
                </Button>
                <Button color="#D32F2F" onClick={() => navigate("/cadastros/usuarios")}>
                    <FaUserShield /> Usuários
                </Button>
                <Button color="#009688" onClick={() => navigate("/cadastros/formas-pagamento")}>
                    <FaCreditCard /> Formas de Pagamento
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default Cadastros;
