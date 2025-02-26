import { Flex, Spacer, Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import colors from "assets/colors";
import { ABOUT, JOIN, GHOST_VARIANT, HOME, TDV } from "assets/constants";

const NavigationBar = () => {
  return (
    <Flex
      as="nav"
      p={4}
      bg={colors.primary}
      alignItems="center"
      data-testid="navigation-bar"
    >
      <Link to="/">
        <Text color={colors.accent} fontSize="lg" fontWeight="bold">
          {TDV}
        </Text>
      </Link>

      <Spacer />
      <Box>
        <Link to="/">
          <Button color={colors.accent} variant={GHOST_VARIANT}>
            {HOME}
          </Button>
        </Link>
        <Link to="/about">
          <Button color={colors.accent} variant={GHOST_VARIANT}>
            {ABOUT}
          </Button>
        </Link>
        <Link to="/join">
          <Button color={colors.accent} variant={GHOST_VARIANT}>
            {JOIN}
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default NavigationBar;
