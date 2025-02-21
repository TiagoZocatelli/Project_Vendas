import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, LoginBox, LoginContainer } from "./styles";

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
        localStorage.setItem("filial_id_user",data.user.filial_id)

        console.log(localStorage.getItem("filial_id_user"))
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
