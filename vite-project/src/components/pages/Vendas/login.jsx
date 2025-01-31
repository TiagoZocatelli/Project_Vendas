import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import api from "../../../api"; 
import {
  Container,
  LoginBox,
  InputGroup,
  Input,
  Button,
  ErrorMessage,
} from "./loginStyles";

const LoginPDV = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!codigo || !senha) {
      setError("⚠️ Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/loginPDV", { codigo, senha });
      const { token, operador } = response.data;

      // 🔹 Armazena os dados no LocalStorage
      localStorage.setItem("tokenPdv", token);
      localStorage.setItem("operador_id", operador.id);
      localStorage.setItem("operador_nome", operador.nome);
      localStorage.setItem("operador_codigo", operador.codigo);

      // 🔹 Redireciona para Vendas após login
      navigate("/vendas");
    } catch (err) {
      setError("⚠️ Código ou senha incorretos!");
    }
  };

  return (
    <Container>
      <LoginBox>
        <h2>Login no PDV</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleLogin}>
          <InputGroup>
            <FaUser />
            <Input
              type="text"
              placeholder="Código do operador"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <FaLock />
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </InputGroup>
          <Button type="submit">
            <FaSignInAlt />
            Entrar
          </Button>
        </form>
      </LoginBox>
    </Container>
  );
};

export default LoginPDV;
