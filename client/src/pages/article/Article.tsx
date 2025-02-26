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

const Article = () => {
  const { id, aId } = useParams();
  const navigate = useNavigate();

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: 2,
    initialState: { currentPage: 1 },
  });

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles/${aId}`);
      return await response.json();
    },
  });

  const article =
    data &&
    data.articles.find(({ articleId }: ArticleProps) => articleId === aId);

  // const { url, summary, imageUrl, articleName, articleId, articleDetails } =
  //   article

  return (
    <Box data-testid="article-page" sx={styles.wrapper}>
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
        <Box>
          <Card sx={styles.header}>
            <CardHeader>
              <Flex>
                <Heading size="md">{article.articleName}</Heading>
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
                    {article.summary}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Divider />
          <Box>
            {/* Instead of a player, you could actually house the project here */}
            <ReactPlayer width="100%" url={article.url} style={styles.url} />
          </Box>
          <Divider />
          <Box>
            <Card sx={styles.markdown}>
              <ReactMarkdown
                components={ChakraUIRenderer()}
                children={article.articleDetails[currentPage - 1]}
                skipHtml
              />
            </Card>
            <Pagination
              pagesCount={pagesCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            >
              <PaginationContainer>
                <PaginationPrevious>Previous</PaginationPrevious>
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
                <PaginationNext>Next</PaginationNext>
              </PaginationContainer>
            </Pagination>
          </Box>
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
    padding: "10px",
    borderRadius: "25px",
  },
  markdown: {
    margin: "10px",
    padding: "10px",
  },
};

export default Article;
