import { Box, Center, Image } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box
      data-testid="home-page"
      sx={{ backgroundImage: "public/matrix.jpg", backgroundSize: "xs" }}
    >
      <Center>
        <Image src="public/tdv.png" />
      </Center>
    </Box>
  );
};

export default Home;
