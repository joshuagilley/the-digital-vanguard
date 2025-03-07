import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ArticleItem from "components/article-item";
import { useTranslation } from "react-i18next";
import { ArticleProps } from "types/user";
import NewArticleItem from "components/new-article-item";

const Portfolio = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles`);
      return await response.json();
    },
  });
  const [isCalling, setIsCalling] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const handleCall = (phoneNumber: string) => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      toast({
        title: "Calling...",
        description: `Calling ${phoneNumber}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      window.location.href = `tel:${phoneNumber}`;
    }, 1000);
  };
  console.log(data);

  const handleEmail = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    email: string
  ) => {
    setIsEmailing(true);
    setTimeout(() => {
      setIsEmailing(false);
      toast({
        title: `${t("portfolio.emailing")}...`,
        description: `${t("portfolio.emailing")} ${email}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      window.location.href = `mailto:${email}`;
      e.preventDefault();
    }, 1000);
  };

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
                color="#f0f6fc"
                size="lg"
              >{`${data[0].username}'s ${t("portfolio.portfolio")}`}</Heading>
              <Spacer />
              <Flex>
                <IconButton
                  icon={<PhoneIcon />}
                  aria-label={`${t("portfolio.call")} ${data[0].phoneNumber}`}
                  onClick={() => handleCall(data[0].phoneNumber)}
                  isLoading={isCalling}
                  colorScheme="whiteAlpha"
                  sx={styles.iconButton}
                  data-testid={"phone"}
                />
                <IconButton
                  icon={<EmailIcon />}
                  aria-label={`${t("portfolio.email")} ${data[0].email}`}
                  onClick={(e) => handleEmail(e, data[0].email)}
                  isLoading={isEmailing}
                  colorScheme="whiteAlpha"
                  sx={styles.iconButton}
                  data-testid={"email"}
                />
              </Flex>
            </Flex>
          </Box>
          <Flex flexWrap="wrap">
            {data?.map((article: ArticleProps) => {
              const { articleName, articleId, userId, phrase } = article;
              return (
                <ArticleItem
                  text={articleName}
                  phrase={phrase}
                  userId={userId}
                  articleId={articleId}
                  refetch={refetch}
                />
              );
            })}

            <NewArticleItem text={"Add Article"} refetch={refetch} />
          </Flex>
        </Box>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
  },
  iconButton: {
    marginRight: "10px",
  },
};

export default Portfolio;
