import {
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationPage,
  PaginationNext,
  usePagination,
} from "@ajna/pagination";
import { Box, Card, Flex, useToast } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import AlertDialogPopUp from "components/alert-dialog-popup";
import { t } from "i18next";
import ReactMarkdown from "react-markdown";
import { ArticleData } from "types/articles";

interface Props {
  hasDetails: boolean;
  isAuth: boolean;
  data: ArticleData[];
  id: string;
  refetchCallback: () => void;
}

const DetailViewWindow = ({
  data,
  hasDetails,
  isAuth,
  id,
  refetchCallback,
}: Props) => {
  const toast = useToast();
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: data?.length,
    initialState: { currentPage: 1 },
  });

  const deleteArticle = async () => {
    const detailId = data && data[currentPage - 1]?.detailId;
    const credential = localStorage.getItem("googleCredential");
    const res = await fetch(`/api/users/${id}/details/${detailId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${credential}`,
      },
    });
    const issue = JSON.stringify(`Status: ${res.status} at ${res.url}`);
    if (res.status !== 200) {
      toast({
        title: "Error",
        description: issue,
        status: "error",
        isClosable: true,
        position: "top",
      });
    } else {
      setCurrentPage(1);
      refetchCallback();
    }
  };

  return (
    <Box>
      {hasDetails && (
        <Card sx={styles.markdown}>
          {isAuth && (
            <AlertDialogPopUp
              deleteText={t("articlePage.deleteDetail")}
              apiCall={deleteArticle}
            />
          )}
          <ReactMarkdown
            components={ChakraUIRenderer()}
            children={data[currentPage - 1].markdown}
            skipHtml
          />
        </Card>
      )}
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
      </Flex>
    </Box>
  );
};

const styles = {
  markdown: {
    margin: "0px 10px 0px 10px",
    padding: "10px",
    height: "600px",
    overflow: "scroll",
    borderRadius: "0px",
    backgroundColor: "#18181a",
    color: "#f0f6fc",
    fontSize: "14px",
    ".chakra-heading": { fontSize: "20px" },
  },
  pagination: { m: "10px" },
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

export default DetailViewWindow;
