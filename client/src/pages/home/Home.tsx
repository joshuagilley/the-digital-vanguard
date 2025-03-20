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

const Home = () => {
  const navigate = useNavigate();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users`);
      return await response.json();
    },
  });

  const handleNavigate = (userId: string) => {
    navigate(`/portfolio/${userId}`);
  };

  return (
    <Box data-testid="home-page" sx={styles.wrapper}>
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
    background: "brand.400",
  },
};

export default Home;
