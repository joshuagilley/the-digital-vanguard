import { Box } from "@chakra-ui/react";
const Home = () => {
  return (
    <Box sx={styles.wrapper} data-testid="home-page">
      {"Welcome to The Digital Vanguard"}
    </Box>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "inherit",
    height: "700px",
    margin: "20px",
    padding: "20px",
    border: "1px solid black",
    borderRadius: "10px",
  },
};

export default Home;
