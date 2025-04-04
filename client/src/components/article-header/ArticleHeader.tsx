import { ArrowLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  Editable,
  EditablePreview,
  EditableInput,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArticleData } from "types/articles";
import { editArticle, rankTagsInString } from "utils/general";
import TagGenerator from "./TagGenerator";

interface Props {
  id: string;
  aId: string;
  isAuth: boolean;
  data: ArticleData[];
  refetch: () => void;
}

const ArticleHeader = ({ id, aId, isAuth, data, refetch }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [articleName, setArticleName] = useState("");
  const [summary, setSummary] = useState("");
  const [prioritizedTags, setPrioritizedTags] = useState([]);

  const handleToast = (issue: string) => {
    toast({
      title: "Error",
      description: issue,
      status: "error",
      isClosable: true,
      position: "top",
    });
  };

  const { data: markdown } = useQuery({
    queryKey: ["markdown", aId], // Different unique query key
    queryFn: async () => {
      const response = await fetch(`/api/get-markdown/${aId}`);
      return await response.json();
    },
  });

  // New API Call to Lambda for Tag Generation
  const { data: tagsData } = useQuery<{
    tags: string[];
  }>({
    queryKey: ["tags", id, aId],
    queryFn: async () => {
      if (!markdown) {
        throw new Error("Markdown data is not available yet");
      }
      const { text } = markdown;
      const lambdaResponse = await fetch(
        process.env.API_GATEWAY_TAG_GENERATOR,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_GATEWAY_KEY,
          },
          body: JSON.stringify({ text: text }),
        }
      );

      if (!lambdaResponse.ok) {
        throw new Error("Failed to fetch tags");
      }

      return await lambdaResponse.json();
    },
  });

  useEffect(() => {
    if (tagsData && tagsData.tags.length > 0) {
      const result = rankTagsInString(markdown?.text, tagsData?.tags);
      setPrioritizedTags(result);
    }
  }, [tagsData]);

  useEffect(() => {
    if (data && data?.length > 0) {
      setArticleName(data[0]?.articleName);
      setSummary(data[0]?.summary);
    }
  }, [data]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>,
    value: string,
    property: string
  ) => {
    if (event.key === "Enter") {
      await editArticle(value, property, id, aId, handleToast, refetch);
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
        <Box m="20px">
          <ArrowLeftIcon
            sx={styles.leftArrow}
            onClick={() => navigate(`/portfolio/${id}`)}
          />
          <Editable
            data-testid="editable-input-name"
            fontSize="2xl"
            fontWeight="bold"
            color="brand.100"
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
          <Stack>
            <Editable
              data-testid="editable-input-summary"
              maxWidth="900px"
              color="brand.600"
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
            <Box minH="25px">
              {prioritizedTags.length > 0 && (
                <TagGenerator tagsData={prioritizedTags} />
              )}
            </Box>
          </Stack>
        </Box>
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
    fontSize: "18px",
    cursor: "pointer",
    color: "brand.600",
    _hover: {
      color: "brand.200",
    },
  },
  mainMarkdownSectionWrapper: { pb: "5px" },
};
