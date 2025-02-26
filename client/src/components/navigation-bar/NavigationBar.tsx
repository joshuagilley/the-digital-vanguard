import { Flex, Spacer, Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ABOUT, JOIN, GHOST_VARIANT, HOME, TDV } from "assets/constants";

const NavigationBar = () => {
  return (
    <Flex
      as="nav"
      p={4}
      bg="brand.100"
      alignItems="center"
      data-testid="navigation-bar"
    >
      <Link to="/">
        <Text color={"brand.200"} fontSize="lg" fontWeight="bold">
          {TDV}
        </Text>
      </Link>

      <Spacer />
      <Box>
        <Link to="/">
          <Button color={"brand.200"} variant={GHOST_VARIANT}>
            {HOME}
          </Button>
        </Link>
        <Link to="/about">
          <Button color={"brand.200"} variant={GHOST_VARIANT}>
            {ABOUT}
          </Button>
        </Link>
        <Link to="/join">
          <Button color={"brand.200"} variant={GHOST_VARIANT}>
            {JOIN}
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default NavigationBar;
