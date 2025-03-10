import { Box, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <Box sx={styles.wrapper} data-testid="about-page">
      <Box sx={styles.mainText}>
        <Heading size="xl">{t("about.vision")}</Heading>
        <Heading size="md" sx={styles.subHeader}>
          {t("about.problem")}
        </Heading>
        <Text>{t("about.problemText")}</Text>
        <Heading size="md" sx={styles.subHeader}>
          {t("about.how")}
        </Heading>
        <Text>{t("about.howText")}</Text>
        <Heading size="md" sx={styles.subHeader}>
          {t("about.consumers")}
        </Heading>
        <Text>{t("about.consumersText")}</Text>
        <Heading size="md" sx={styles.subHeader}>
          {t("about.tracking")}
        </Heading>
        <Text>{t("about.trackingText")}</Text>
        <Heading size="md" sx={styles.subHeader}>
          {t("about.medium")}
        </Heading>
        <Text>{t("about.mediumText")}</Text>
      </Box>
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100%",
  },
  mainText: {
    margin: "20px",
    padding: "20px",
    color: "#e0ceb5",
  },
  subHeader: {
    mt: "15px",
    mb: "5px",
  },
};

export default About;
