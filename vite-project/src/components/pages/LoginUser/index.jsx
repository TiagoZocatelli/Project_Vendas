import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;

const Users = () => {
  const [login, setLogin] = useState(""); // ✅ Corrigido para aceitar Nome ou Email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha: password }) 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("tokenUsers", data.token);
        localStorage.setItem("userName", data.user.nome); // 🔹 Armazena o nome do usuário
        navigate("/home"); // 🔹 Redireciona após login
      } else {
        setError(data.error || "Erro ao tentar fazer login");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
    }
  };  

  return (
    <LoginContainer>
      <LoginBox>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <Input 
            type="text" 
            placeholder="Nome ou Email" // ✅ Alterado para aceitar nome e email
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Entrar</Button>
        </form>
      </LoginBox>
    </LoginContainer>
  );
};

export default Users;
