import { Flex, Spacer, Box, Button, IconButton, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HOME } from "assets/constants";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionStack = motion(Stack);

const NavigationBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Flex as="nav" sx={styles.navBar} data-testid="navigation-bar">
      <Spacer />
      <AnimatePresence>
        {open && (
          <MotionStack
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            sx={styles.menu}
          >
            <Box m="auto">
              <Link to="/" onClick={() => setOpen(false)}>
                <Button sx={styles.menuButton}>{HOME}</Button>
              </Link>
            </Box>
          </MotionStack>
        )}
      </AnimatePresence>
      <IconButton
        aria-label="Open Menu"
        data-testid="hamburger"
        size="md"
        mr={2}
        backgroundColor="brand.300"
        icon={<HamburgerIcon />}
        as={motion.button}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        sx={styles.hamburger}
      />
    </Flex>
  );
};

export default NavigationBar;

const styles = {
  navBar: {
    p: 4,
    bg: "brand.400",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "brand.300",
    position: "fixed",
    right: "24px",
    top: "80px",
    width: "140px",
    padding: "12px",
    zIndex: 10,
    borderRadius: "8px",
    boxShadow: "lg",
  },
  menuButton: {
    fontWeight: "bold",
    backgroundColor: "brand.300",
    transition: "all 0.2s ease-in-out",
    borderBottom: "1px solid",
    borderBottomColor: "brand.700",
    borderRadius: "0",
    _hover: {
      color: "brand.100",
      transform: "scale(1.05)",
    },
  },
  hamburger: {
    transition: "all 0.2s ease-in-out",
    _hover: {
      backgroundColor: "brand.200",
      transform: "rotate(90deg)",
    },
  },
};
