// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "#f0f6fc",
      200: "#919192",
      300: "#e0ceb5",
      400: "#F4F4F4",
      500: "#121212",
      600: "#ffffff",
      700: "#080808",
    },
  },
});
