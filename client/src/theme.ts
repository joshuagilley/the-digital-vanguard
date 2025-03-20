// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "#E0E0E0", // off white
      200: "#ffb2ff", // secondary
      300: "#ea80fc", // primary
      400: "#121212", // main background black
      500: "#202020", // secondary black
      600: "#898989", // subtext grey
      700: "#1E1E1E", // off black
    },
  },
});
