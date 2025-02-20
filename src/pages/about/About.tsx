import { Box } from "@chakra-ui/react";
const About = () => {
  return (
    <Box sx={styles.wrapper} data-testid="about-page">
      {"About Page"}
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "700px",
    margin: "20px",
    padding: "20px",
    border: "1px solid black",
    borderRadius: "10px",
  },
};

export default About;
