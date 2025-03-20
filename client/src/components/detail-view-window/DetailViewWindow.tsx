import {
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationPage,
  PaginationNext,
  usePagination,
} from "@ajna/pagination";
import { Box, Card, Flex, Spacer, useToast } from "@chakra-ui/react";
import MarkdownButton from "assets/markdown-button";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import AddDetailModal from "components/add-detail-modal";
import AlertDialogPopUp from "components/alert-dialog-popup";
import ReplaceDetailModal from "components/replace-detail-modal";
import { t } from "i18next";
import ReactMarkdown from "react-markdown";
import { ArticleData } from "types/articles";

interface Props {
  isAuth: boolean;
  data: ArticleData[];
  id: string;
  aid: string;
  hasDetails: boolean;
  refetchCallback: () => void;
}

const DetailViewWindow = ({
  data,
  isAuth,
  id,
  aid,
  hasDetails,
  refetchCallback,
}: Props) => {
  const toast = useToast();
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: data?.length,
    initialState: { currentPage: 1 },
  });

  const sortDetails = async () => {
    const credential = localStorage.getItem("googleCredential");
    try {
      await fetch(`/api/users/${id}/articles/${aid}/detail-sort`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${credential}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sortValue: currentPage }),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: JSON.stringify(error),
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const deleteArticle = async () => {
    const detailId = data && data[currentPage - 1]?.detailId;
    const credential = localStorage.getItem("googleCredential");
    const res = await fetch(`/api/users/${id}/details/${detailId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${credential}` },
    });
    await sortDetails();
    if (res.status !== 200) {
      toast({
        title: "Error",
        description: `Status: ${res.status} at ${res.url}`,
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
    <Box p={4}>
      <Card sx={styles.markdown}>
        <Flex mb={4}>
          {isAuth && (
            <>
              <AlertDialogPopUp
                deleteText={t("articlePage.deleteDetail")}
                apiCall={deleteArticle}
              />
              <ReplaceDetailModal
                refetch={refetchCallback}
                sortValue={currentPage}
                detailId={data[currentPage - 1]?.detailId}
              />
            </>
          )}
        </Flex>
        <ReactMarkdown
          components={ChakraUIRenderer()}
          children={data[currentPage - 1]?.markdown}
          skipHtml
        />
      </Card>
      <Flex sx={styles.pagination} align="center" mt={6}>
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
        <Spacer />
        {isAuth && (
          <Flex gap={4} align="center">
            <MarkdownButton />
            <AddDetailModal
              refetch={refetchCallback}
              sortValue={hasDetails ? data.length + 1 : 1}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

const styles = {
  markdown: {
    padding: "20px",
    height: "600px",
    overflowY: "auto",
    borderRadius: "8px",
    backgroundColor: "#18181a",
    color: "#f0f6fc",
    fontSize: "12px",
    ".chakra-heading": { fontSize: "22px" },
  },
  pagination: { mt: "20px", px: "10px" },
  paginationPrevious: { mr: "6px" },
  paginationNext: { ml: "6px" },
  paginationPage: { w: 8, fontSize: "md" },
  paginationPageHover: { bg: "brand.300" },
  paginationCurrent: { w: 8, bg: "brand.200", fontSize: "md" },
};

export default DetailViewWindow;
