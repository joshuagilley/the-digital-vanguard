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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertDialogPopUp from "components/alert-dialog-popup";
import { QueryObserverResult } from "@tanstack/react-query";
import { isFirstDigitTwo } from "utils/general";
import { useTranslation } from "react-i18next";
import { useAuth } from "hooks/auth";

type Props = {
  text: string;
  tag: string;
  userId: string;
  articleId: string;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
};

const ArticleItem = ({ text, tag, userId, articleId, refetch }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const getAuth = async () => {
    const credential = localStorage.getItem("googleCredential") || "";
    const r = await fetch(`/api/auth/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer: ${credential}` },
    });
    return r;
  };

  const { data: authData } = useAuth(getAuth, []) as any;

  useEffect(() => {
    if (isAuth === null && authData) {
      setIsAuth(authData.status === 200);
    }
  });

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
        <Box sx={styles.tag}>{tag}</Box>
        <Text sx={styles.mainText}>{text}</Text>
      </CardBody>
      <CardFooter p="10px">
        {isAuth && (
          <Flex>
            <AlertDialogPopUp
              deleteText={t("articleItem.deleteArticle")}
              apiCall={deleteArticle}
            />
          </Flex>
        )}
        <Spacer />
        <Button
          sx={styles.continue}
          colorScheme="whiteAlpha"
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
    cursor: "pointer",
    p: "2px 10px 2px 10px",
    borderRadius: 0,
  },
  card: {
    backgroundColor: "#18181a",
    color: "brand.700",
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
