import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Select,
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
        <Alert status="error" data-testid="error">
          <AlertIcon />
          <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
          <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
        </Alert>
      )}
      {!isPending && !isFetching && !error && (
        <Box sx={styles.dropdown}>
          <Select
            placeholder={"</>"}
            variant="filled"
            onChange={handleNavigate}
            sx={styles.select}
          >
            {data.map(({ username, userId }: User, index: number) => (
              <option value={userId} key={index}>
                {username}
              </option>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    h: "100vh",
    placeContent: "center",
    background: "#080808",
  },
  dropdown: {
    w: "200px",
    m: "auto auto 150px auto",
  },
  select: {
    backgroundColor: "brand.300",
  },
};

export default Home;
