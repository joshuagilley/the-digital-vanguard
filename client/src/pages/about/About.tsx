import { Box, Divider, Heading, Text } from "@chakra-ui/react";

const About = () => {
  return (
    <Box sx={styles.wrapper} data-testid="about-page">
      <Box sx={styles.mainText}>
        <Heading size="xl">{"Vision"}</Heading>
        <Divider />
        <Heading size="md" sx={styles.subHeader}>
          {"The Problem"}
        </Heading>
        <Text>
          Staying up to date with tech is overwhelming. Resources are scattered,
          and platforms like YouTube flood users with outdated or irrelevant
          tutorials. The Digital Vanguard (TDV) solves this by organizing
          everything into a single ecosystem, ranking content through an
          AI-powered system that prioritizes value—keeping information current,
          relevant, and widely applicable.
        </Text>
        <Heading size="md" sx={styles.subHeader}>
          {"How The Digital Vanguard Works"}
        </Heading>
        <Text>
          Users can sign up as developers or consumers. Developers tag their
          interests (React, Full Stack, Blockchain, etc.) and gain a
          personalized experience. Consumers can browse, search topics, or
          follow specific developers. TDV acts as a living portfolio. Instead of
          fragmented personal blogs and portfolios, developers get a unified
          profile (e.g., thedigitalvanguard.io/johndoe), linking all their
          articles, thoughts, and projects in one place. This fosters a strong,
          exclusive community—being part of the Vanguard.
        </Text>
        <Heading size="md" sx={styles.subHeader}>
          {"For Consumers"}
        </Heading>
        <Text>
          TDV blends elements of GitHub, Reddit, and Medium. Users can explore
          topics like “Full Stack” or “FinTech” and discover top-ranked
          developers based on engagement (likes, shares, and ‘helpful’
          feedback). The more a developer contributes, the higher they rank.
        </Text>
        <Heading size="md" sx={styles.subHeader}>
          {"Project Tracking & Portfolio Building"}
        </Heading>
        <Text>
          TDV provides structured project tracking. Instead of abandoning ideas
          after brief experimentation, developers create entities—structured
          project pages with: • A name & tech tags • A markdown editor for
          progress tracking • A place to link the finished project (e.g., a
          hosted site or demo video) TDV even guides users in deploying projects
          at the lowest cost, ensuring work isn’t lost but becomes a shareable
          portfolio piece.
        </Text>
        <Heading size="md" sx={styles.subHeader}>
          {"Why not just use something like Medium?"}
        </Heading>
        <Text>
          Medium is broad and unfocused—anyone can write about anything. TDV is
          developer-centric. An AI/ML review board ensures content remains
          tech-focused, filtering out unrelated topics. TDV isn’t just a blog
          platform; it’s a structured space for passionate tech professionals to
          track progress, build portfolios, and stay ahead in their field.
        </Text>
      </Box>
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
  },
  mainText: {
    margin: "20px",
    padding: "20px",
    border: "1px solid black",
    borderRadius: "10px",
  },
  subHeader: {
    mt: "15px",
    mb: "5px",
  },
};

export default About;
