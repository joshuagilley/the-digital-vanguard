import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "pages/home";
import About from "pages/about";
import Join from "pages/join";
import NavigationBar from "components/navigation-bar/NavigationBar";
// import Footer from "components/footer";
import Portfolio from "pages/portfolio";
import Article from "pages/article";
import { theme } from "./theme";

const queryClient = new QueryClient();

function App() {
  return (
    <GoogleOAuthProvider clientId={`${process.env.GOOGLE_OAUTH_CLIENTID}`}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Box bg="#080808" minHeight="100vh">
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
            {/* <Footer /> */}
          </Box>
        </ChakraProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
