import { useState, useEffect } from "react";
import { Flex, Avatar, IconButton } from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";

const AvatarFlip = ({ username, email, avatar, isAuth }) => {
  const [flipped, setFlipped] = useState(false);

  // Auto flip back after 5 seconds
  useEffect(() => {
    if (flipped) {
      const timer = setTimeout(() => setFlipped(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flipped]);

  const handleEmail = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    email: string
  ) => {
    window.location.href = `mailto:${email}`;
    e.preventDefault();
  };

  return (
    <Flex gap="5px" mr="20px" position="relative" width="50px" height="50px">
      <AnimatePresence>
        {!flipped ? (
          <motion.div
            key="avatar"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ position: "absolute", width: "100%" }}
          >
            <Avatar
              color="brand.100"
              backgroundColor="brand.700"
              size="md"
              name={username}
              src={avatar}
              cursor="pointer"
              onClick={() => setFlipped(true)}
            />
          </motion.div>
        ) : (
          isAuth && (
            <motion.div
              key="email"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ position: "absolute", width: "100%" }}
            >
              <IconButton
                icon={<EmailIcon />}
                aria-label={`Email ${email}`}
                onClick={(e) => handleEmail(e, email)}
                colorScheme="whiteAlpha"
                sx={styles.iconButton}
                data-testid={"email"}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default AvatarFlip;

const styles = {
  iconButton: {
    borderRadius: "50%",
    padding: "10px",
    fontSize: "lg",
    width: "48px",
    height: "48px",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",

    _hover: {
      transform: "scale(1.1)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      backgroundColor: "brand.300",
      color: "white",
    },

    _focus: {
      outline: "none",
      boxShadow: "0 0 15px rgba(0, 0, 255, 0.4)",
      backgroundColor: "brand.400",
    },

    _active: {
      transform: "scale(0.95)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
  },
};
