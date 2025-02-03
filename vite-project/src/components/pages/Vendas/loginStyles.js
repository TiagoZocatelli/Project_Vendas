import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #0d1b2a, #102C57);
`;

export const LoginBox = styled.div`
  background: white;
  padding: 35px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  width: 380px;
  text-align: center;
  
  h2 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #102C57;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  background: #f9f9f9;

  svg {
    color: #102C57;
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  padding-left: 12px;
  font-size: 16px;
  background: transparent;
`;

export const FixedButton = styled.button`
position: fixed;
top: 10px;
left: 10px;
padding: 10px 20px;
font-size: 16px;
cursor: pointer;
border: none;
border-radius: 5px;
background-color: #102C57;
color: white;
transition: 0.3s;
z-index: 1000;

&:hover {
  background-color: #081A3A;
}
`;


export const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 17px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(135deg, #0d1b2a, #102C57);
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

export const ErrorMessage = styled.p`
  color: #d9534f;
  font-size: 15px;
  font-weight: bold;
  background: #fdecea;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 15px;
`;
