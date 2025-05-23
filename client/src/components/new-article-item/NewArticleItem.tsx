import { Card, CardBody, Text, Center } from "@chakra-ui/react";
import { useState } from "react";
import { QueryObserverResult } from "@tanstack/react-query";
import NewArticleModal from "components/new-article-modal";

type Props = {
  text: string;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
};

const NewArticleItem = ({ text, refetch }: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card
      data-testid="new-article-item"
      sx={isHovering ? { ...styles.card, ...styles.cardHover } : styles.card}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardBody>
        <Center>
          <Text sx={styles.text}>{text}</Text>
        </Center>
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
    color: "brand.400",
    cursor: "pointer",
    w: "400px",
    height: "150px",
    m: "40px",
    variant: "outline",
    align: "center",
    border: "none",
  },
  cardHover: {
    color: "brand.300",
    boxShadow: `inset 0 0 0.5px 1px hsla(0, 0%,  
              100%, 0.075),
              /* shadow ring 👇 */
              0 0 0 1px hsla(0, 0%, 0%, 0.05),
              /* multiple soft shadows 👇 */
              0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),
              0 0.9px 1.5px hsla(0, 0%, 0%, 0.045),
              0 3.5px 6px hsla(0, 0%, 0%, 0.09)`,
  },
  text: {
    color: "brand.200",
    fontSize: "20px",
    fontWeight: "bold",
    m: "auto",
    mt: "10px",
  },
};

export default NewArticleItem;
