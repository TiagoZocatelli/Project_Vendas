import styled from "styled-components";

export const Notification = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: ${({ type }) =>
    type === "success"
      ? "linear-gradient(145deg, #4caf50, #81c784)" /* Gradiente verde */
      : "linear-gradient(145deg, #ff6347, #ff867f)"}; /* Gradiente vermelho */
  color: #ffffff;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  font-weight: bold;
  z-index: 1000;
  display: flex;
  align-items: center; /* Alinha o ícone e o texto */
  gap: 10px; /* Espaçamento entre ícone e texto */
  animation: fadeIn 0.4s ease, fadeOut 0.4s ease 3s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;