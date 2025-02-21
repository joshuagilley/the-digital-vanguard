import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "pages/home";
import About from "pages/about";
import Contact from "pages/contact";
import NavigationBar from "components/navigation-bar/NavigationBar";
import colors from "assets/colors";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Box sx={styles.wrapper}>
          <Router>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Router>
        </Box>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

const styles = {
  wrapper: {
    backgroundColor: colors.neutral,
  },
};

export default App;
