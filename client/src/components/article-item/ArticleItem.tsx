import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertDialogPopUp from "components/alert-dialog-popup";
import { QueryObserverResult } from "@tanstack/react-query";
import { isFirstDigitTwo } from "utils/general";
import { useTranslation } from "react-i18next";

type Props = {
  text: string;
  tag?: string;
  userId: string;
  articleId: string;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  isAuthenticated?: boolean;
};

const ArticleItem = ({
  text,
  tag,
  userId,
  articleId,
  refetch,
  isAuthenticated,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const isAuth =
    isAuthenticated || userId === localStorage.getItem("authenticatedId");

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const deleteArticle = async () => {
    try {
      const credential = localStorage.getItem("googleCredential");
      const res = await fetch(`/api/users/${userId}/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      });
      if (!isFirstDigitTwo(res.status)) {
        throw new Error(`Got ${res.status} at ${res.url}`);
      }
      refetch();
    } catch (error) {
      const description = error instanceof Error ? error.message : "";
      toast({
        title: "Error",
        description,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Card
      variant="outline"
      sx={isHovering ? { ...styles.card, ...styles.cardHover } : styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardBody>
        <Flex gap="5px" flexWrap="wrap">
          {tag.split(",").map((t, index) => (
            <Box key={`tag-${index}`} sx={styles.tag}>
              {t}
            </Box>
          ))}
        </Flex>
        <Text sx={styles.mainText}>{text}</Text>
      </CardBody>
      <CardFooter p="10px">
        {isAuth && (
          <Flex>
            <AlertDialogPopUp
              deleteText={t("articleItem.deleteArticle")}
              primaryColor="brand.600"
              secondaryColor="brand.300"
              apiCall={deleteArticle}
            />
          </Flex>
        )}
        <Spacer />
        <Button
          sx={styles.continue}
          onClick={() => navigate(`/portfolio/${userId}/articles/${articleId}`)}
        >
          {t("articleItem.continue")}
        </Button>
      </CardFooter>
    </Card>
  );
};
const styles = {
  continue: {
    backgroundColor: "brand.600",
    _hover: {
      backgroundColor: "brand.200",
    },
    cursor: "pointer",
    p: "2px 10px 2px 10px",
    borderRadius: 0,
  },
  card: {
    backgroundColor: "#18181a",
    color: "brand.400",
    border: "2px solid transparent",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
    w: "400px",
    height: "150px",
    m: "40px",
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
  tag: {
    width: "fit-content",
    fontWeight: "bold",
    color: "#f0f6fc",
    fontSize: "11px",
    backgroundColor: "#3f3f46",
    padding: "2px 3px 2px 3px",
    borderRadius: "3px",
  },
  mainText: {
    fontWeight: "bold",
    color: "#f0f6fc",
    size: "md",
  },
};

export default ArticleItem;
