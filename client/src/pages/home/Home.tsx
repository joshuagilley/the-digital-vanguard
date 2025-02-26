import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Image,
  Select,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { User } from "types/user";

const Home = () => {
  const navigate = useNavigate();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users`);
      return await response.json();
    },
  });

  const handleNavigate = (e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    navigate(`/portfolio/${value}`);
  };

  return (
    <Box data-testid="home-page" sx={styles.wrapper}>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
          <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
        </Alert>
      )}
      {(isPending || isFetching) && (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
      {!isPending && !isFetching && !error && (
        <Box
          data-testid="home-page"
          sx={{ backgroundImage: "matrix.jpg", backgroundSize: "xs" }}
        >
          <Center>
            <Image src="tdv.png" />
          </Center>
          <Box sx={styles.dropdown}>
            <Select
              placeholder="Select a dev"
              onChange={handleNavigate}
              variant="filled"
            >
              {data.map(({ username, userId }: User, index: number) => (
                <option value={userId} key={index}>
                  {username}
                </option>
              ))}
            </Select>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
  },
  dropdown: {
    position: "absolute",
    top: "75px",
    margin: "10px",
  },
};

export default Home;
