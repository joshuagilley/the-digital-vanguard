import {
  Box,
  Stack,
  Card,
  CardBody,
  CardHeader,
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
  Link,
  Text,
  useToast,
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
import { useEffect, useState } from "react";
import AlertDialogPopUp from "components/alert-dialog-popup";
import { AlertComponent, SkeletonComponent } from "utils/component-utils";

const Article = () => {
  const { id, aId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [editedArticleName, setEditArticleName] = useState("");
  const [editedSummary, setEditSummary] = useState("");
  const [hasDetails, setHasDetails] = useState(false);
  const [articleName, setArticleName] = useState("");
  const [summary, setSummary] = useState("");
  const [url, setUrl] = useState("");

  type Props = {
    articleId: string;
    articleName: string;
    date: string;
    detailId: string;
    markdown: string;
    phrase: string;
    sortValue: number;
    summary: string;
    url: string;
    userId: string;
  };

  const { isPending, error, data, isFetching, refetch } = useQuery<
    Props[],
    Error
  >({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles/${aId}`);
      return await response.json();
    },
  });

  useEffect(() => {
    if (data && data?.length > 0) {
      const hasD = data?.find(
        ({ detailId }: { detailId: string }) => detailId !== null
      );
      setHasDetails(hasD !== undefined);
      setUrl(data[0]?.url);
      setArticleName(data[0]?.articleName);
      setSummary(data[0]?.summary);
    }
  }, [data]);

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: data?.length,
    initialState: { currentPage: 1 },
  });

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>,
    value: string,
    property: string
  ) => {
    if (event.key === "Enter") {
      editArticle(value, property);
    }
  };

  const handleChange = (str: string, isSummary: boolean) => {
    if (isSummary) {
      setEditSummary(str);
    } else {
      setEditArticleName(str);
    }
  };

  const editArticle = async (changeText: string, property: string) => {
    const res = await fetch(`/api/articles/${aId}`, {
      method: "PUT",
      body: JSON.stringify({ changeText, property }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) {
      toast({
        title: "Error",
        description: JSON.stringify(`Status: ${res.status} at ${res.url}`),
        status: "error",
        isClosable: true,
      });
    }
  };

  const deleteArticle = async () => {
    const detailId = data && data[currentPage - 1].detailId;
    const res = await fetch(`/api/details/${detailId}`, {
      method: "DELETE",
    });
    setCurrentPage(1);
    refetch();
    if (res.status !== 200) {
      toast({
        title: "Error",
        description: JSON.stringify(`Status: ${res.status} at ${res.url}`),
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box data-testid="article-page" sx={styles.wrapper}>
      {error && <AlertComponent />}
      {(isPending || isFetching) && <SkeletonComponent />}
      {!isPending && !isFetching && !error && data && (
        <Box data-test="article">
          <Box m="10px">
            <Flex>
              <FormControl sx={styles.showDemo}>
                <FormLabel htmlFor="email-alerts" mb="0">
                  {t("articlePage.showDemo")}
                </FormLabel>
                <Switch
                  id="email-alerts"
                  onChange={() => setShowDemo(!showDemo)}
                />
              </FormControl>
              <Spacer />
              <Text sx={styles.favoriteEditor}>
                <Link href="https://stackedit.io/app#" target="_blank">
                  {t("articlePage.favoriteEditor")}
                </Link>
              </Text>
            </Flex>
            {showDemo && <ReactPlayer url={url} style={styles.url} />}
          </Box>
          {!showDemo && (
            <Box>
              <Card sx={styles.header}>
                <CardHeader>
                  <Flex>
                    <Editable
                      fontSize="2xl"
                      fontWeight="bold"
                      color="brand.300"
                      defaultValue={articleName}
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          editedArticleName,
                          t("articlePage.articleName")
                        )
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
                      {t("articlePage.back")}
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Editable
                      fontSize="xs"
                      fontWeight="none"
                      defaultValue={summary}
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          editedSummary,
                          t("articlePage.summary")
                        )
                      }
                      onChange={(e) => handleChange(e, true)}
                    >
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </Stack>
                </CardBody>
              </Card>
              <Card sx={styles.markdown}>
                <AlertDialogPopUp
                  deleteText={t("articlePage.deleteDetail")}
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
                      sx={styles.noFiles}
                      src={t("articlePage.noFilesUrl")}
                    />
                  </Center>
                )}
              </Card>
              <Flex sx={styles.pagination}>
                {hasDetails && (
                  <Pagination
                    pagesCount={pagesCount}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  >
                    <PaginationContainer>
                      <PaginationPrevious sx={styles.paginationPrevious}>
                        {t("articleItem.previous")}
                      </PaginationPrevious>
                      <PaginationPageGroup>
                        {pages.map((page: number) => (
                          <PaginationPage
                            key={`pagination_page_${page}`}
                            page={page}
                            sx={styles.paginationPage}
                            _hover={styles.paginationPageHover}
                            _current={{
                              ...styles.paginationCurrent,
                              _hover: styles.paginationPageHover,
                            }}
                          />
                        ))}
                      </PaginationPageGroup>
                      <PaginationNext sx={styles.paginationNext}>
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
  favoriteEditor: {
    w: "300px",
    color: "brand.200",
  },
  showDemo: {
    display: "flex",
    alignItems: "center",
    color: "brand.100",
  },
  noFiles: {
    w: "100px",
    m: "auto",
  },
  pagination: {
    m: "10px",
    position: "sticky",
  },
  paginationPrevious: {
    mr: "4px",
  },
  paginationNext: {
    ml: "4px",
  },
  paginationPage: {
    w: 7,
    fontSize: "sm",
  },
  paginationPageHover: {
    bg: "brand.300",
  },
  paginationCurrent: {
    w: 7,
    bg: "brand.200",
    fontSize: "sm",
  },
};

export default Article;
