// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "#010e1a",
      200: "#1F77FF",
      300: "#E63946",
      400: "#F4F4F4",
      500: "#121212",
      600: "#ffffff",
      700: "#000000",
    },
  },
});
