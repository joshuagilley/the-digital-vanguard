import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import { ArticleProps } from "types/pages";

const Article = () => {
  const { id, aId } = useParams();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles`);
      return await response.json();
    },
  });

  const articles = data?.articles.filter(
    ({ articleId }: ArticleProps) => articleId === aId
  );
  return (
    <Box data-testid="article-page">
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
          <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
        </Alert>
      )}
      {(isPending || isFetching) && (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
      {!isPending && !isFetching && !error && (
        <Box>
          <Box>{id}</Box>
          <Box>{JSON.stringify(articles)}</Box>
        </Box>
      )}
    </Box>
  );
};

export default Article;
