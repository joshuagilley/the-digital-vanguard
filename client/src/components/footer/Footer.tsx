import { Flex } from "@chakra-ui/react";
import LanguageChanger from "components/language-changer";

const Footer = () => {
  return (
    <Flex
      as="nav"
      p={4}
      bg="brand.100"
      alignItems="left"
      data-testid="navigation-bar"
      sx={styles}
    >
      <LanguageChanger />
    </Flex>
  );
};

const styles = {
  position: "sticky",
  left: 0,
  bottom: 0,
  right: 0,
};

export default Footer;
