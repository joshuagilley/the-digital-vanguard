import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "components/search-input";
import { t } from "i18next";
import GoogleLoginComponent from "pages/google-login";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users`);
      return await response.json();
    },
  });

  const [fadeIn, setFadeIn] = useState(0);

  useEffect(() => {
    setTimeout(() => setFadeIn(1), 500);
  }, []);

  const handleNavigate = (userId: string) => {
    navigate(`/portfolio/${userId}`);
  };

  return (
    <Box
      data-testid="home-page"
      sx={{
        ...styles.wrapper,
        opacity: fadeIn,
        transition: "opacity 1.5s ease-in-out",
      }}
    >
      {error && (
        <Alert status="error" data-testid="error">
          <AlertIcon />
          <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
          <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
        </Alert>
      )}
      {!isPending && !isFetching && !error && (
        <Center mb="250px">
          <Flex gap="10px">
            <SearchInput data={data} handleNavigate={handleNavigate} />
            <GoogleLoginComponent />
          </Flex>
        </Center>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    h: "100vh",
    mx: "auto",
    placeContent: "center",
    backgroundImage: `url('${process.env.TDV_LOGO}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
};

export default Home;
