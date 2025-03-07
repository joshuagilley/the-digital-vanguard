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
  Center,
  Image,
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

  const hasDetails = data?.find(
    ({ detailId }: { detailId: string }) => detailId !== null
  );

  const deleteDetail = async () => {
    const detailId = data[currentPage - 1].detailId;
    const res = await fetch(`/api/details/${detailId}`, {
      method: "DELETE",
    });
    refetch();
    console.log(res);
  };
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
          <Card sx={styles.header}>
            <CardHeader>
              <Flex>
                <Heading size="md">{data[0]?.articleName}</Heading>
                <Spacer />
                <Button size="sm" onClick={() => navigate(`/portfolio/${id}`)}>
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
                  <Text pt="2" fontSize="sm">
                    {data[0]?.summary}
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
            {showDemo && <ReactPlayer url={data[0]?.url} style={styles.url} />}
          </Box>
          {!showDemo && (
            <Box>
              <Card sx={styles.markdown}>
                <Box mr="10px">
                  <AlertDialogPopUp
                    deleteText="Delete Detail"
                    apiCall={deleteDetail}
                  />
                </Box>
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
              <Flex m="10px">
                {hasDetails && (
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
    height: "500px",
    overflow: "scroll",
  },
};

export default Article;
