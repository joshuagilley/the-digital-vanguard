import { ArrowLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardHeader,
  Flex,
  Spacer,
  Editable,
  EditablePreview,
  EditableInput,
  CardBody,
  Stack,
  StackDivider,
  useToast,
} from "@chakra-ui/react";
import AddDetailModal from "components/add-detail-modal";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Data {
  articleId: string;
  articleName: string;
  detailId: string;
  markdown: string;
  tag: string;
  sortValue: number;
  summary: string;
  url: string;
  userId: string;
}

interface Props {
  id: string;
  aId: string;
  isAuth: boolean;
  hasDetails: boolean;
  data: Data[];
  refetch: () => void;
}

const ArticleHeader = ({
  id,
  aId,
  isAuth,
  hasDetails,
  data,
  refetch,
}: Props) => {
  console.log(data);
  const toast = useToast();
  const navigate = useNavigate();
  const [articleName, setArticleName] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (data && data?.length > 0) {
      setArticleName(data[0]?.articleName);
      setSummary(data[0]?.summary);
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
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>,
    value: string,
    property: string
  ) => {
    if (event.key === "Enter") {
      await editArticle(value, property);
    }
  };

  const handleChange = (str: string, isSummary: boolean) => {
    if (isSummary) {
      setSummary(str);
    } else {
      setArticleName(str);
    }
  };
  return (
    <Box sx={styles.mainMarkdownSectionWrapper}>
      <Card sx={styles.header}>
        <CardHeader>
          <Flex>
            <ArrowLeftIcon
              sx={styles.leftArrow}
              onClick={() => navigate(`/portfolio/${id}`)}
            />
            <Spacer />
            {isAuth && (
              <AddDetailModal
                refetch={() => refetch()}
                sortValue={hasDetails ? data.length + 1 : 1}
              />
            )}
          </Flex>
          <Editable
            data-testid="editable-input-name"
            fontSize="2xl"
            fontWeight="bold"
            color="brand.300"
            value={articleName}
            isDisabled={!isAuth}
            onKeyDown={(e) =>
              handleKeyDown(e, articleName, t("articlePage.articleName"))
            }
            onChange={(e) => handleChange(e, false)}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Editable
              data-testid="editable-input-summary"
              fontSize="xs"
              fontWeight="none"
              isDisabled={!isAuth}
              value={summary}
              onKeyDown={(e) =>
                handleKeyDown(e, summary, t("articlePage.summaryProp"))
              }
              onChange={(e) => handleChange(e, true)}
            >
              <EditablePreview />
              <EditableInput />
            </Editable>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ArticleHeader;

const styles = {
  header: {
    margin: "10px 10px 2px 10px",
    borderRadius: "5px 5px 0px 0px",
    backgroundColor: "#18181a",
    color: "#f0f6fc",
  },
  leftArrow: {
    cursor: "pointer",
    _hover: {
      color: "brand.300",
    },
  },
  mainMarkdownSectionWrapper: { pb: "5px" },
};
