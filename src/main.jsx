import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import React, {Suspense} from "react";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import theme from "../styles/theme";
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
