import {
  Card,
  Stack,
  CardBody,
  Heading,
  CardFooter,
  Button,
  Image,
} from "@chakra-ui/react";
import colors from "assets/colors";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ArticleItem = ({
  text,
  image_url,
}: {
  text: string;
  image_url: string;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { t } = useTranslation();

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      sx={isHovering ? { ...styles.card, ...styles.cardHover } : styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        objectFit="scale-down"
        maxW={{ base: "100%", sm: "200px" }}
        src={image_url}
        alt="Caffe Latte"
      />

      <Stack>
        <CardBody>
          <Heading size="md">{text}</Heading>
        </CardBody>

        <CardFooter>
          <Button variant="solid" colorScheme="blue">
            {t("articleItem.explore")}
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
};
const styles = {
  card: {
    backgroundColor: colors.white,
    color: colors.black,
    border: "2px solid transparent",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  },
  cardHover: {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
  },
};

export default ArticleItem;
