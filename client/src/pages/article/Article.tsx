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
  Flex,
  Spacer,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Center,
  Image,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
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
import AlertDialogPopUp from "components/alert-dialog-popup";

const Article = () => {
  const { id, aId } = useParams();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [articleName, setArticleName] = useState("");
  const [summary, setSummary] = useState("");

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>,
    value: string,
    property: string
  ) => {
    if (event.key === "Enter") {
      const res = await editArticle(value, property);
      console.log(res);
    }
  };

  const handleChange = (str: string, isSummary: boolean) => {
    if (isSummary) {
      setSummary(str);
    } else {
      setArticleName(str);
    }
  };

  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles/${aId}`);
      return await response.json();
    },
  });

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: data?.length,
    initialState: { currentPage: 1 },
  });

  const editArticle = async (changeText: string, property: string) => {
    const res = await fetch(`/api/articles/${aId}`, {
      method: "PUT",
      body: JSON.stringify({ changeText, property }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(res);
  };

  const deleteArticle = async () => {
    const detailId = data[currentPage - 1].detailId;
    const res = await fetch(`/api/details/${detailId}`, {
      method: "DELETE",
    });
    setCurrentPage(1);
    refetch();
    console.log(res);
  };

  const hasDetails = data?.find(
    ({ detailId }: { detailId: string }) => detailId !== null
  );

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
      {!isPending && !isFetching && !error && data && (
        <Box data-test="article">
          <Box m="10px">
            <FormControl display="flex" alignItems="center">
              <FormLabel color="#f0f6fc" htmlFor="email-alerts" mb="0">
                {"Show Demo"}
              </FormLabel>
              <Switch
                id="email-alerts"
                onChange={() => setShowDemo(!showDemo)}
              />
            </FormControl>
            {/* Instead of a player, you could actually house the project here */}
            {showDemo && <ReactPlayer url={data[0]?.url} style={styles.url} />}
          </Box>
          {!showDemo && (
            <Box>
              <Card sx={styles.header}>
                <CardHeader>
                  <Flex>
                    <Editable
                      fontSize="2xl"
                      fontWeight="bold"
                      color="#e0ceb5"
                      defaultValue={data[0]?.articleName}
                      onKeyDown={(e) =>
                        handleKeyDown(e, articleName, "article_name")
                      }
                      onChange={(e) => handleChange(e, false)}
                    >
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                    <Spacer />
                    <Button
                      size="sm"
                      onClick={() => navigate(`/portfolio/${id}`)}
                    >
                      {`Back`}
                    </Button>
                  </Flex>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        {t("articleItem.summary")}
                      </Heading>
                      <Editable
                        fontSize="xs"
                        defaultValue={data[0]?.summary}
                        onKeyDown={(e) => handleKeyDown(e, summary, "summary")}
                        onChange={(e) => handleChange(e, true)}
                      >
                        <EditablePreview />
                        <EditableInput />
                      </Editable>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
              <Card sx={styles.markdown}>
                <AlertDialogPopUp
                  deleteText="Delete Detail"
                  apiCall={deleteArticle}
                />
                {hasDetails ? (
                  <ReactMarkdown
                    components={ChakraUIRenderer()}
                    children={data[currentPage - 1].markdown}
                    skipHtml
                  />
                ) : (
                  <Center m="auto">
                    <Image
                      color="gray.300"
                      w="100px"
                      src="https://cdn-icons-png.flaticon.com/512/1092/1092216.png"
                    />
                  </Center>
                )}
              </Card>
              <Flex m="10px" position="sticky">
                {hasDetails && (
                  <Pagination
                    pagesCount={pagesCount}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  >
                    <PaginationContainer>
                      <PaginationPrevious mr={"4px"}>
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
                      <PaginationNext ml={"4px"}>
                        {t("articleItem.next")}
                      </PaginationNext>
                    </PaginationContainer>
                  </Pagination>
                )}
                <Spacer />
                <AddDetailModal
                  refetch={refetch}
                  sortValue={hasDetails ? data.length + 1 : 1}
                />
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
    margin: "10px 10px 2px 10px",
    borderRadius: "5px 5px 0px 0px",
    backgroundColor: "#18181a",
    color: "#f0f6fc",
  },
  url: {
    margin: "auto",
    paddingTop: "10px",
    borderRadius: "25px",
  },
  markdown: {
    margin: "0px 10px 0px 10px",
    padding: "10px",
    height: "60vh",
    overflow: "scroll",
    borderRadius: "0px",
    backgroundColor: "#18181a",
    color: "#f0f6fc",
  },
};

export default Article;
