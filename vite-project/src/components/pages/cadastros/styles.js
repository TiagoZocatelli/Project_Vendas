import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #102C57, #1E3A5F); /* 🔹 Fundo com gradiente */
  margin-left: 250px;
`;

export const Title = styled.h2`
  margin-bottom: 40px;
  font-size: 30px;
  font-weight: bold;
  color: white; /* 🔹 Texto branco para contraste */
`;

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  justify-content: center;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin-bottom: 250px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 100px; /* 🔹 Botões grandes */
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  background: ${({ color }) => color || "#007bff"};
  color: white;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.07);
    box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.4);
  }

  svg {
    font-size: 30px;
  }
`;
