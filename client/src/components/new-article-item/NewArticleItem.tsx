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
      w="400px"
      height="150px"
      m="40px"
      variant="outline"
      align="center"
      border="none"
      sx={isHovering ? { ...styles.card, ...styles.cardHover } : styles.card}
      width="400px"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardBody>
        <Heading color="#f0f6fc" size="md">
          {text}
        </Heading>
        <Center>
          <NewArticleModal isHovering={isHovering} refetch={refetch} />
        </Center>
      </CardBody>
    </Card>
  );
};
const styles = {
  card: {
    backgroundColor: "#18181a",
    color: "brand.700",
    cursor: "pointer",
  },
  cardHover: {
    boxShadow: `inset 0 0 0.5px 1px hsla(0, 0%,  
              100%, 0.075),
              /* shadow ring 👇 */
              0 0 0 1px hsla(0, 0%, 0%, 0.05),
              /* multiple soft shadows 👇 */
              0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),
              0 0.9px 1.5px hsla(0, 0%, 0%, 0.045),
              0 3.5px 6px hsla(0, 0%, 0%, 0.09)`,
  },
};

export default ArticleItem;
