import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertDialogPopUp from "components/alert-dialog-popup";
import { QueryObserverResult } from "@tanstack/react-query";

type Props = {
  text: string;
  phrase: string;
  userId: string;
  articleId: string;
  refetch?: () => Promise<QueryObserverResult<any, Error>>;
};

const ArticleItem = ({ text, phrase, userId, articleId, refetch }: Props) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const deleteArticle = async () => {
    const res = await fetch(`/api/articles/${articleId}`, {
      method: "DELETE",
    });
    refetch && refetch();
    console.log(res);
  };

  return (
    <Card
      w="400px"
      height="150px"
      m="40px"
      variant="outline"
      sx={isHovering ? { ...styles.card, ...styles.cardHover } : styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardBody>
        <Box
          width="fit-content"
          fontWeight="bold"
          color="#f0f6fc"
          fontSize="11px"
          backgroundColor="#3f3f46"
          padding="2px 3px 2px 3px"
          borderRadius="3px"
        >
          {phrase}
        </Box>
        <Text fontWeight="bold" color="#f0f6fc" size="md">
          {text}
        </Text>
      </CardBody>
      <CardFooter p="10px">
        <Flex>
          <AlertDialogPopUp
            deleteText="Delete Article"
            apiCall={deleteArticle}
          />
        </Flex>
        <Spacer />
        <Button
          cursor="pointer"
          colorScheme="whiteAlpha"
          p="2px 10px 2px 10px"
          onClick={() => navigate(`/portfolio/${userId}/articles/${articleId}`)}
          borderRadius="0"
        >
          {"Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};
const styles = {
  card: {
    backgroundColor: "#18181a",
    color: "brand.700",
    border: "2px solid transparent",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
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
