import {
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationPage,
  PaginationNext,
  usePagination,
} from "@ajna/pagination";
import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  Flex,
  Spacer,
  useToast,
  Switch,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";
import MarkdownButton from "assets/markdown-button";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import AddDetailModal from "components/add-detail-modal";
import AlertDialogPopUp from "components/alert-dialog-popup";
import ReplaceDetailModal from "components/replace-detail-modal";
import { t } from "i18next";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { ArticleData } from "types/articles";
import { editArticle } from "utils/general";
import MarkdownTheme from "./MarkdownTheme";

interface Props {
  isAuth: boolean;
  data: ArticleData[];
  id: string;
  aid: string;
  hasDetails: boolean;
  url: string;
  refetchCallback: () => void;
}

const DetailViewWindow = ({
  data,
  isAuth,
  id,
  aid,
  hasDetails,
  url,
  refetchCallback,
}: Props) => {
  const [editingUrl, setEditingUrl] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [showDemo, setShowDemo] = useState(false);
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

  const handleToast = (issue: string) => {
    toast({
      title: "Error",
      description: issue,
      status: "error",
      isClosable: true,
      position: "top",
    });
  };

  const invalidUrl = (incomingUrl: string) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+)$/i;
    if (!youtubeRegex.test(incomingUrl)) {
      toast({
        title: "Error",
        description: "Invalid Youtube URL.",
        status: "error",
        isClosable: true,
        position: "top",
      });
    }

    return !youtubeRegex.test(incomingUrl);
  };

  const editUrl = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      if (newUrl === "") {
        setEditingUrl(false);
        return;
      }
      if (invalidUrl(newUrl)) {
        setNewUrl("");
      } else {
        await editArticle(newUrl, "url", id, aid, handleToast, () =>
          refetchCallback()
        );
      }
      setEditingUrl(false);
    }
  };

  return (
    <Box p={4}>
      <Card sx={styles.markdown}>
        <Flex>
          <Box sx={styles.floatingBox}>
            <Flex>
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
          </Box>
          <Spacer />
          <Switch
            sx={{ position: "absolute", top: 0, right: 0, m: "15px" }}
            isChecked={showDemo}
            onChange={() => setShowDemo(!showDemo)}
          >
            Demo
          </Switch>
          {showDemo && (
            <Box>
              {!editingUrl && (
                <EditIcon
                  data-testid="edit-url-icon"
                  sx={styles.editUrlIcon}
                  onClick={() => setEditingUrl(true)}
                />
              )}
              {editingUrl && (
                <Editable
                  data-testid="editable-url"
                  sx={styles.editableUrl}
                  value={newUrl === "" ? url : newUrl}
                  isDisabled={!isAuth}
                  onKeyDown={(e) => editUrl(e)}
                  onChange={(e) => setNewUrl(e)}
                  startWithEditView
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              )}
            </Box>
          )}
        </Flex>

        {showDemo ? (
          <Box mt={"10px"}>
            <ReactPlayer url={url} controls width="100%" height="600px" />
          </Box>
        ) : (
          <ReactMarkdown
            components={ChakraUIRenderer(MarkdownTheme)}
            children={data[currentPage - 1]?.markdown}
            skipHtml
          />
        )}
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
    p: "30px 20px 20px 20px",
    bg: "brand.500",
    color: "brand.100",
    borderRadius: "md",
    boxShadow: "lg",
    border: "1px solid",
    borderColor: "gray.700",
    maxH: "600px",
    overflowY: "auto",
    css: {
      "&::-webkit-scrollbar": { width: "6px" },
      "&::-webkit-scrollbar-thumb": {
        background: "gray.600",
        borderRadius: "8px",
      },
      "&::-webkit-scrollbar-track": { background: "gray.700" },
    },
  },
  floatingBox: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "brand.200",
    borderRadius: "0 0 5px 0",
    p: "8px",
    m: "auto",
  },
  pagination: { mt: "20px", px: "10px" },
  paginationPrevious: { mr: "6px" },
  paginationNext: { ml: "6px" },
  paginationPage: { w: 8, fontSize: "md" },
  paginationPageHover: { bg: "brand.300" },
  paginationCurrent: { w: 8, bg: "brand.200", fontSize: "md" },
  editUrlIcon: {
    fontSize: "22px",
    m: "10px",
    color: "brand.300",
    _hover: { cursor: "pointer", color: "brand.200" },
  },
  editableUrl: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "brand.300",
    m: "10px 0px 0 10px",
    w: "400px",
  },
};

export default DetailViewWindow;
