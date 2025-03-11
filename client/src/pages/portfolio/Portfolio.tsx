import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { EmailIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import ArticleItem from "components/article-item";
import { useTranslation } from "react-i18next";
import NewArticleItem from "components/new-article-item";
import { PortfolioResponse } from "types/user";
import { useAuth } from "src/hooks/auth";

const Portfolio = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  // const [isCalling, setIsCalling] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [response, setResponse] = useState<PortfolioResponse[]>([]);
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const getAuth = async () => {
    const credential = localStorage.getItem("googleCredential") || "";
    const r = await fetch(`/api/auth/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer: ${credential}` },
    });
    return r;
  };

  const { data: authData } = useAuth(getAuth, [id]);

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
      // setPhoneNumber(data[0]?.phoneNumber);
      setUsername(data[0]?.username);
      setEmail(data[0]?.email);
    }
  }, [data]);

  useEffect(() => {
    if (isAuth === null && authData) {
      setIsAuth(authData.status === 200);
    }
  });

  // const handleCall = (phoneNumber: string) => {
  //   setIsCalling(true);
  //   setTimeout(() => {
  //     setIsCalling(false);
  //     toast({
  //       title: "Calling...",
  //       description: `Calling ${phoneNumber}`,
  //       status: "info",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     window.location.href = `tel:${phoneNumber}`;
  //   }, 1000);
  // };

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
                color="brand.100"
                size="lg"
              >{`${username}'s ${t("portfolio.portfolio")}`}</Heading>
              <Spacer />
              <Flex>
                {/* <IconButton
                    icon={<PhoneIcon />}
                    aria-label={`${t("portfolio.call")} ${phoneNumber}`}
                    onClick={() => handleCall(phoneNumber)}
                    isLoading={isCalling}
                    colorScheme="whiteAlpha"
                    data-testid={"phone"}
                    sx={styles.iconButton}
                  /> */}
                {isAuth && (
                  <IconButton
                    icon={<EmailIcon />}
                    aria-label={`${t("portfolio.email")} ${email}`}
                    onClick={(e) => handleEmail(e, email)}
                    isLoading={isEmailing}
                    colorScheme="whiteAlpha"
                    sx={styles.iconButton}
                    data-testid={"email"}
                  />
                )}
              </Flex>
            </Flex>
          </Box>
          <Flex sx={styles.articleWrapper}>
            {Array.from(response)?.map(
              ({ articleName, articleId, userId, tag }: PortfolioResponse) => {
                return (
                  articleId && (
                    <ArticleItem
                      text={articleName}
                      tag={tag}
                      userId={userId}
                      articleId={articleId}
                      refetch={refetch}
                    />
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
    marginRight: "10px",
  },
  articleWrapper: {
    flexWrap: "wrap",
    justifyContent: "left",
  },
};

export default Portfolio;
