import { createGlobalStyle } from "styled-components";



// Definindo os estilos globais
const GlobalStyle = createGlobalStyle`
  * {
    text-decoration: none;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  body {
    background: #0000;
  }

  a {
    text-decoration: none;
  }
`;

export default GlobalStyle;