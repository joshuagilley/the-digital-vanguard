import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
