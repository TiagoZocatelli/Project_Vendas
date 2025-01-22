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
    color: #333333; /* Texto em cinza escuro */
    background-color: #f3f4f6; /* Fundo claro para o conteúdo principal */
  }

  a {
    text-decoration: none;
  }
`;

export default GlobalStyle;