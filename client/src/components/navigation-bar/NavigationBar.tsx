import {
  Flex,
  Spacer,
  Box,
  Button,
  Image,
  IconButton,
  Stack,
  CloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ABOUT, JOIN, HOME } from "assets/constants";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";

const NavigationBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Flex
      as="nav"
      p={4}
      bg="#080808"
      alignItems="center"
      data-testid="navigation-bar"
    >
      <Link to="/" onClick={() => setOpen(false)}>
        <Image w="40px" borderRadius="5px" src="public/knight.png" />
      </Link>

      <Spacer />
      {open && (
        <Stack
          backgroundColor="#e0ceb5"
          position="fixed"
          right="24px"
          top="80px"
          width="140px"
          padding="10px"
          zIndex={1}
        >
          <CloseButton
            position="absolute"
            right="0"
            top="0"
            onClick={() => setOpen(!open)}
          />
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
          <Box margin="auto">
            <Link to="/join" onClick={() => setOpen(false)}>
              <Button fontWeight="bold" variant="ghost">
                {JOIN}
              </Button>
            </Link>
          </Box>
        </Stack>
      )}
      <IconButton
        aria-label="Open Menu"
        data-testid="hamburger"
        size="md"
        mr={2}
        backgroundColor="#e0ceb5"
        icon={<HamburgerIcon />}
        onClick={() => setOpen(!open)}
      />
    </Flex>
  );
};

export default NavigationBar;
