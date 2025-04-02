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
// import { useEffect } from "react";
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

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8000/generate-tags", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         text: "I love javascript so much!",
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // // Call the fetchData function when the component mounts
  // useEffect(() => {
  //   fetchData();
  // }, []);

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
