import {
  Flex,
  Spacer,
  Box,
  Button,
  IconButton,
  Stack,
  CloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ABOUT, HOME } from "assets/constants";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";

const NavigationBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Flex as="nav" sx={styles.navBar} data-testid="navigation-bar">
      <Spacer />
      {open && (
        <Stack sx={styles.inputWrappers}>
          <CloseButton sx={styles.close} onClick={() => setOpen(!open)} />
          <Box m="auto">
            <Link to="/" onClick={() => setOpen(false)}>
              <Button fontWeight="bold" variant="ghost">
                {HOME}
              </Button>
            </Link>
          </Box>
          <Box m="auto">
            <Link to="/about" onClick={() => setOpen(false)}>
              <Button fontWeight="bold" variant="ghost">
                {ABOUT}
              </Button>
            </Link>
          </Box>
          {/* <Box margin="auto">
            <Link to="/join" onClick={() => setOpen(false)}>
              <Button fontWeight="bold" variant="ghost">
                {JOIN}
              </Button>
            </Link>
          </Box> */}
        </Stack>
      )}
      <IconButton
        aria-label="Open Menu"
        data-testid="hamburger"
        size="md"
        mr={2}
        backgroundColor="brand.300"
        icon={<HamburgerIcon />}
        onClick={() => setOpen(!open)}
      />
    </Flex>
  );
};

export default NavigationBar;

const styles = {
  navBar: {
    p: 4,
    bg: "brand.700",
    alignItems: "center",
  },
  close: {
    position: "absolute",
    right: "0",
    top: "0",
  },
  inputWrappers: {
    backgroundColor: "brand.300",
    position: "fixed",
    right: "24px",
    top: "80px",
    width: "140px",
    padding: "10px",
    zIndex: 1,
  },
};
