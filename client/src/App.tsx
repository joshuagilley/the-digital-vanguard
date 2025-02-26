import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "pages/home";
import About from "pages/about";
import Join from "pages/join";
import NavigationBar from "components/navigation-bar/NavigationBar";
import colors from "assets/colors";
import Footer from "components/footer";
import Portfolio from "pages/portfolio";
import Article from "pages/article";

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
              <Route path="/join" element={<Join />} />
              <Route path="/portfolio/:id" element={<Portfolio />} />
              <Route
                path="/portfolio/:id/articles/:aId"
                element={<Article />}
              />
            </Routes>
          </Router>
          <Footer />
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
