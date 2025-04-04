import {
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationPage,
  PaginationNext,
  usePagination,
} from "@ajna/pagination";
import {
  Box,
  Card,
  Flex,
  Spacer,
  useToast,
  Editable,
  EditableInput,
  EditablePreview,
  Center,
  Tooltip,
} from "@chakra-ui/react";
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
import { ExternalLinkIcon, TvMinimalPlay } from "lucide-react";

interface Props {
  isAuth: boolean;
  data: ArticleData[];
  id: string;
  aid: string;
  hasDetails: boolean;
  url: string;
  refetchTags: () => void;
  refetchCallback: () => void;
}

const DetailViewWindow = ({
  data,
  isAuth,
  id,
  aid,
  hasDetails,
  url,
  refetchTags,
  refetchCallback,
}: Props) => {
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
        return;
      }
      if (invalidUrl(newUrl)) {
        setNewUrl("");
      } else {
        await editArticle(newUrl, "url", id, aid, handleToast, () =>
          refetchCallback()
        );
      }
    }
  };

  return (
    <Box p={4}>
      {hasDetails && (
        <Card sx={styles.markdown}>
          <Flex>
            <Box sx={styles.floatingBox}>
              <Flex gap="15px">
                {isAuth && (
                  <>
                    <AlertDialogPopUp
                      deleteText={t("articlePage.deleteDetail")}
                      primaryColor="brand.700"
                      secondaryColor="brand.300"
                      apiCall={deleteArticle}
                    />
                    <ReplaceDetailModal
                      refetch={refetchCallback}
                      sortValue={currentPage}
                      detailId={data[currentPage - 1]?.detailId}
                    />
                    <Box
                      sx={{
                        ...styles.youtube,
                        ...(showDemo && {
                          bg: "#ffb2ff",
                          color: "white",
                          borderRadius: "md",
                          transform: "translateY(2px)",
                          boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.2)",
                        }),
                      }}
                      onClick={() => setShowDemo(!showDemo)}
                    >
                      <Tooltip label="Demo">
                        <Box p="1">
                          <TvMinimalPlay size={24} />
                        </Box>
                      </Tooltip>
                    </Box>
                  </>
                )}
              </Flex>
            </Box>
            <Spacer />
            {showDemo && (
              <Editable
                placeholder="Edit url"
                data-testid="editable-url"
                sx={styles.editableUrl}
                value={newUrl}
                isDisabled={!isAuth}
                onKeyDown={(e) => editUrl(e)}
                onChange={(e) => setNewUrl(e)}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
            )}
          </Flex>

          {showDemo ? (
            <Center mt={"10px"}>
              <ReactPlayer url={url} controls />
            </Center>
          ) : (
            <ReactMarkdown
              components={ChakraUIRenderer(MarkdownTheme)}
              children={data[currentPage - 1]?.markdown}
              skipHtml
            />
          )}
        </Card>
      )}
      <Flex sx={styles.pagination} align="center" mt={6}>
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
        {isAuth && (
          <Flex gap={4} align="center">
            <Box sx={styles.stackEdit}>
              <a
                href="https://stackedit.io/app#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon size="30" />
              </a>
            </Box>
            <AddDetailModal
              refetch={refetchCallback}
              refetchTags={refetchTags}
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
    p: "40px 20px 20px 20px",
    bg: "brand.500",
    color: "brand.100",
    borderRadius: "md",
    boxShadow: "lg",
    border: "1px solid",
    borderColor: "gray.700",
    maxH: "600px",
    overflowY: "auto",
    scrollbarColor: "#898989 #202020",

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
    color: "brand.600",
    width: "300px",
    maxWidth: "400px",
    position: "absolute",
    right: "10px",
    top: "10px",
    textAlign: "right",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
    border: "1px solid",
    borderColor: "brand.600",
    borderRadius: "8px",
    padding: "4px 8px",
    transition: "all 0.3s ease-in-out",
    height: "30px",
    p: "auto",

    // **Cool hover effect**
    _hover: {
      borderColor: "brand.500",
      boxShadow: "0 0 15px #898989",
      transform: "scale(1.03)",
    },

    // **Smooth focus effect**
    _focusWithin: {
      borderColor: "brand.400",
      boxShadow: "0 0 15px #ea80fc",
      backgroundColor: "brand.500",
      transform: "scale(1.04)",
    },
  },
  stackEdit: {
    color: "brand.300",
    _hover: {
      color: "brand.200",
      cursor: "pointer",
    },
  },
  youtube: {
    color: "brand.700",
    transition: "all 0.15s ease-in-out",
    _hover: {
      color: "brand.300",
      cursor: "pointer",
    },
  },
};

export default DetailViewWindow;
