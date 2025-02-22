import { Flex, Spacer, Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import colors from "assets/colors";
import { ABOUT, CONTACT, GHOST_VARIANT, HOME, TDV } from "assets/constants";
import { useQuery } from "@tanstack/react-query";

const NavigationBar = () => {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(
        `/api/users/${import.meta.env.VITE_JOSH_USER_ID}/articles`
      );
      return await response.json();
    },
  });
  console.log(isPending, error, data, isFetching);

  return (
    <Flex
      as="nav"
      p={4}
      bg={colors.primary}
      alignItems="center"
      data-testid="navigation-bar"
    >
      <Text color={colors.accent} fontSize="lg" fontWeight="bold">
        {TDV}
      </Text>
      <Spacer />
      <Box>
        <Link to="/" style={styles.homeLink}>
          <Button color={colors.accent} variant={GHOST_VARIANT}>
            {HOME}
          </Button>
        </Link>
        <Link to="/about">
          <Button color={colors.accent} variant={GHOST_VARIANT}>
            {ABOUT}
          </Button>
        </Link>
        <Link to="/contact">
          <Button color={colors.accent} variant={GHOST_VARIANT}>
            {CONTACT}
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

const styles = {
  homeLink: {
    marginRight: "1rem",
  },
};

export default NavigationBar;
