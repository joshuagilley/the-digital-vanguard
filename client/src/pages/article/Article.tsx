import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Skeleton,
  Card,
  CardBody,
  CardHeader,
  Heading,
  StackDivider,
  Text,
  Flex,
  Spacer,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleProps } from "types/user";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { AddDetailModal } from "components/add-detail-modal/AddDetailModal";
import { useState } from "react";

const Article = () => {
  const { id, aId } = useParams();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles/${aId}`);
      return await response.json();
    },
  });

  // should handle this in the query, workaround for now
  const article = data?.articles.find(
    ({ articleId }: ArticleProps) => articleId === aId
  );

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: article?.articleDetails.length,
    initialState: { currentPage: 1 },
  });

  return (
    <Box data-testid="article-page" sx={styles.wrapper}>
      {error && (
        <Alert status="error" data-testid="error">
          <AlertIcon />
          <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
          <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
        </Alert>
      )}
      {(isPending || isFetching) && (
        <Stack data-testid="skeleton">
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
      {!isPending && !isFetching && !error && (
        <Box data-test="article">
          <Card sx={styles.header}>
            <CardHeader>
              <Flex>
                <Heading size="md">{article?.articleName}</Heading>
                <Spacer />
                <Button size="sm" onClick={() => navigate(`/portfolio/${id}`)}>
                  {`${data?.username}'s ${t("portfolio.portfolio")}`}
                </Button>
              </Flex>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    {t("articleItem.summary")}
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {article?.summary}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Divider />
          <Box m="10px">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                Demo
              </FormLabel>
              <Switch
                id="email-alerts"
                onChange={() => setShowDemo(!showDemo)}
              />
            </FormControl>
            {/* Instead of a player, you could actually house the project here */}
            {showDemo && <ReactPlayer url={article?.url} style={styles.url} />}
          </Box>
          {!showDemo && (
            <Box>
              <Box>
                <Card sx={styles.markdown} height="500px" overflow={"scroll"}>
                  <ReactMarkdown
                    components={ChakraUIRenderer()}
                    children={article?.articleDetails[currentPage - 1]}
                    skipHtml
                  />
                </Card>
              </Box>
              <Flex m="10px">
                <Pagination
                  pagesCount={pagesCount}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                >
                  <PaginationContainer>
                    <PaginationPrevious>
                      {t("articleItem.previous")}
                    </PaginationPrevious>
                    <PaginationPageGroup>
                      {pages.map((page: number) => (
                        <PaginationPage
                          key={`pagination_page_${page}`}
                          page={page}
                          w={7}
                          fontSize="sm"
                          _hover={{
                            bg: "brand.200",
                          }}
                          _current={{
                            w: 7,
                            bg: "brand.200",
                            fontSize: "sm",
                            _hover: {
                              bg: "blue.300",
                            },
                          }}
                        />
                      ))}
                    </PaginationPageGroup>
                    <PaginationNext>{t("articleItem.next")}</PaginationNext>
                  </PaginationContainer>
                </Pagination>
                <Spacer />
                <AddDetailModal refetch={refetch} />
              </Flex>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
  },
  header: {
    margin: "10px",
  },
  url: {
    margin: "auto",
    paddingTop: "10px",
    borderRadius: "25px",
  },
  markdown: {
    margin: "10px",
    padding: "10px",
  },
};

export default Article;
