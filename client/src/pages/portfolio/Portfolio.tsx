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
  Skeleton,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ArticleItem from "components/article-item";
import { useTranslation } from "react-i18next";
import { Article } from "types/pages";

const Portfolio = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles`);
      return await response.json();
    },
  });

  const toast = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const handleCall = (phone_number: string) => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      toast({
        title: "Calling...",
        description: `Calling ${phone_number}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      window.location.href = `tel:${phone_number}`;
    }, 1000);
  };

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
    <Box>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
          <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
        </Alert>
      )}
      {(isPending || isFetching) && (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
      {!isPending && !isFetching && !error && (
        <Box data-testid="portfolio-page" sx={styles.wrapper}>
          <Box bg="gray.100" p={4}>
            <Flex align="center">
              <Heading size="lg">{`${data.user_name}'s ${t("portfolio.portfolio")}`}</Heading>
              <Spacer />
              <Flex>
                <IconButton
                  icon={<PhoneIcon />}
                  aria-label={`${t("portfolio.call")} ${data.phone_number}`}
                  onClick={() => handleCall(data.phone_number)}
                  isLoading={isCalling}
                  colorScheme="blackAlpha"
                  sx={styles.iconButton}
                />
                <IconButton
                  icon={<EmailIcon />}
                  aria-label={`${t("portfolio.email")} ${data.email}`}
                  onClick={(e) => handleEmail(e, data.email)}
                  isLoading={isEmailing}
                  colorScheme="blackAlpha"
                  sx={styles.iconButton}
                />
              </Flex>
            </Flex>
          </Box>
          <SimpleGrid columns={2} spacing={10} margin={5}>
            {data?.articles.map((article: Article) => {
              const { article_name } = article;
              return (
                <ArticleItem
                  text={article_name}
                  image_url={article.image_url}
                />
              );
            })}
          </SimpleGrid>
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
