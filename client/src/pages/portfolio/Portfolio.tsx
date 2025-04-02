import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ArticleItem from "components/article-item";
import { useTranslation } from "react-i18next";
import NewArticleItem from "components/new-article-item";
import { PortfolioResponse } from "types/user";
import AvatarFlip from "components/avatar-flip";

interface Props {
  isAuthenticated?: boolean;
}
const Portfolio = ({ isAuthenticated }: Props) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [response, setResponse] = useState<PortfolioResponse[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const isAuth =
    isAuthenticated || id === localStorage.getItem("authenticatedId");
  // even if this is manipulated on the fronted, there is a check in the backend on the google credential before anychanges can be made. Research vulnerabilities of change the token and if we need to do something about that.
  const { isPending, error, data, isFetching, refetch } = useQuery<
    PortfolioResponse[],
    Error
  >({
    queryKey: [],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}/articles`, {});
      return await res.json();
    },
  });

  useEffect(() => {
    if (data && data?.length > 0) {
      setResponse(data);
      setUsername(data[0]?.username);
      setEmail(data[0]?.email);
      setAvatar(data[0]?.picture);
    }
  }, [data]);

  return (
    <Box sx={styles.wrapper} data-testid="portfolio-page">
      {error && (
        <Alert status="error" data-testid="error">
          <AlertIcon />
          <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
          <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
        </Alert>
      )}
      {!isPending && !isFetching && !error && data && (
        <Box>
          <Box p={4}>
            <Flex align="center">
              <Heading
                h="50px"
                size="2xl"
                bgGradient="linear(to-r, brand.300, brand.500)"
                bgClip="text"
                fontWeight="bold"
                textAlign="center"
                letterSpacing="wide"
                ml="25px"
              >
                {`${username}'s ${t("portfolio.portfolio")}`}
              </Heading>
              <Spacer />
              <AvatarFlip
                isAuth={isAuth}
                avatar={avatar}
                email={email}
                username={username}
              />
            </Flex>
          </Box>
          <Flex sx={styles.articleWrapper}>
            {Array.from(response)?.map(
              (
                { articleName, articleId, userId, tag }: PortfolioResponse,
                index
              ) => {
                return (
                  articleId && (
                    <Box key={`article-item-${index}`}>
                      <ArticleItem
                        text={articleName}
                        tag={tag}
                        userId={userId}
                        articleId={articleId}
                        refetch={refetch}
                      />
                    </Box>
                  )
                );
              }
            )}
            {isAuth && (
              <NewArticleItem
                text={t("portfolio.addArticle")}
                refetch={refetch}
              />
            )}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100%",
  },
  iconButton: {
    borderRadius: "50%",
    padding: "10px",
    fontSize: "lg",
    width: "48px",
    height: "48px",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",

    _hover: {
      transform: "scale(1.1)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      backgroundColor: "brand.300",
      color: "white",
    },

    _focus: {
      outline: "none",
      boxShadow: "0 0 15px rgba(0, 0, 255, 0.4)",
      backgroundColor: "brand.400",
    },

    _active: {
      transform: "scale(0.95)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
  },
  articleWrapper: {
    flexWrap: "wrap",
    justifyContent: "left",
  },
};

export default Portfolio;
