import {
  Box,
  Flex,
  Spacer,
  FormControl,
  FormLabel,
  Switch,
  Editable,
  EditableInput,
  EditablePreview,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import ReactPlayer from "react-player";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertComponent } from "utils/component-utils";
import DetailViewWindow from "components/detail-view-window";
import ArticleHeader from "components/article-header";

interface Props {
  isAuthenticated?: boolean;
}
const Article = ({ isAuthenticated }: Props) => {
  const { id, aId } = useParams();
  const toast = useToast();
  const [showDemo, setShowDemo] = useState(false);
  const [hasDetails, setHasDetails] = useState(false);
  const [url, setUrl] = useState("");
  const [editingUrl, setEditingUrl] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const isAuth =
    isAuthenticated || id === localStorage.getItem("authenticatedId");

  type Props = {
    articleId: string;
    articleName: string;
    date: string;
    detailId: string;
    markdown: string;
    tag: string;
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
    }
  }, [data]);

  const editArticle = async (changeText: string, property: string) => {
    const credential = localStorage.getItem("googleCredential");
    const res = await fetch(`/api/users/${id}/articles/${aId}`, {
      method: "PUT",
      body: JSON.stringify({ changeText, property }),
      headers: {
        Authorization: `Bearer ${credential}`,
        "Content-Type": "application/json",
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
      refetch();
    }
  };

  const invalidUrl = (incomingUrl: string) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
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
      if (invalidUrl(newUrl)) {
        setNewUrl("");
      } else {
        await editArticle(newUrl, "url");
      }
      setEditingUrl(false);
    }
  };

  return (
    <Box data-testid="article-page" sx={styles.wrapper}>
      {error && <AlertComponent />}
      {!isPending && !isFetching && !error && data && (
        <Box data-test="article">
          <Box m="10px">
            <Flex>
              <Flex>
                <FormControl sx={styles.showDemo}>
                  <FormLabel htmlFor="email-alerts" mb="0">
                    {t("articlePage.showDemo")}
                  </FormLabel>
                  <Switch
                    id="email-alerts"
                    data-testid="show-demo"
                    onChange={() => setShowDemo(!showDemo)}
                  />
                </FormControl>
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
              <Spacer />
              <Text sx={styles.favoriteEditor}>
                <Link href="https://stackedit.io/app#" target="_blank">
                  {t("articlePage.favoriteEditor")}
                </Link>
              </Text>
            </Flex>
            {showDemo && (
              <ReactPlayer
                width="80%"
                height="60vh"
                url={url}
                style={styles.url}
              />
            )}
          </Box>
          {!showDemo && (
            <ArticleHeader
              id={id || ""}
              aId={aId || ""}
              isAuth={isAuth}
              hasDetails={hasDetails}
              data={data}
              refetch={() => refetch()}
            />
          )}
          <DetailViewWindow
            hasDetails={hasDetails}
            isAuth={isAuth}
            id={id || ""}
            data={data}
            refetchCallback={() => refetch()}
          />
        </Box>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100%",
  },
  url: {
    margin: "auto",
    paddingTop: "10px",
    borderRadius: "25px",
  },
  favoriteEditor: {
    w: "250px",
    color: "brand.200",
  },
  editUrlIcon: {
    m: "10px",
    color: "brand.300",
    _hover: { cursor: "pointer", color: "brand.200" },
  },
  editableUrl: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "brand.300",
    ml: "10px",
    w: "400px",
  },
  showDemo: {
    display: "flex",
    alignItems: "center",
    color: "brand.100",
  },
};

export default Article;
