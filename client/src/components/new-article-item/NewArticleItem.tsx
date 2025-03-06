import { Card, CardBody, Heading, Center } from "@chakra-ui/react";
import { useState } from "react";
import { NewArticleModal } from "./NewArticleModal";
import { QueryObserverResult } from "@tanstack/react-query";

type Props = {
  text: string;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
};

const ArticleItem = ({ text, refetch }: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <Card
      overflow="hidden"
      variant="outline"
      align="center"
      sx={isHovering ? { ...styles.card, ...styles.cardHover } : styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardBody sx={{ mt: "15px" }}>
        <Heading size="md">{text}</Heading>
        <Center>
          <NewArticleModal isHovering={isHovering} refetch={refetch} />
        </Center>
      </CardBody>
    </Card>
  );
};
const styles = {
  card: {
    backgroundColor: "brand.600",
    color: "brand.700",
    border: "2px solid transparent",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  },
  cardHover: {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
  },
};

export default ArticleItem;
