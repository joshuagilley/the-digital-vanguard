import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertComponent } from "utils/component-utils";
import DetailViewWindow from "components/detail-view-window";
import ArticleHeader from "components/article-header";
import { ArticleData } from "types/articles";

interface Props {
  isAuthenticated?: boolean;
}
const Article = ({ isAuthenticated }: Props) => {
  const { id = "", aId = "" } = useParams();
  const [hasDetails, setHasDetails] = useState(false);
  const [url, setUrl] = useState("");
  const isAuth =
    isAuthenticated || id === localStorage.getItem("authenticatedId");

  const { isPending, error, data, isFetching, refetch } = useQuery<
    ArticleData[],
    Error
  >({
    queryKey: ["articles", id, aId], // Unique query key
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}/articles/${aId}`);
      return await response.json();
    },
  });

  const { data: markdown } = useQuery({
    queryKey: ["markdown", aId], // Different unique query key
    queryFn: async () => {
      const response = await fetch(`/api/get-markdown/${aId}`);
      return await response.json();
    },
  });

  // New API Call to Lambda for Tag Generation
  // const { data: tagsData, error: tagsError } = useQuery({
  //   queryKey: ["tags", id, aId],
  //   queryFn: async () => {
  //     const { text } = markdown;
  //     const lambdaResponse = await fetch(
  //       "https://8ldpvopzq5.execute-api.us-east-2.amazonaws.com/TagGenerator2",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ text }),
  //       }
  //     );
  //     console.log(lambdaResponse);

  //     if (!lambdaResponse.ok) {
  //       throw new Error("Failed to fetch tags");
  //     }

  //     return await lambdaResponse.json();
  //   },
  //   enabled: !!data?.[0], // Only run if data is available
  // });
  // console.log(tagsData, tagsError);

  useEffect(() => {
    if (data && data?.length > 0) {
      const hasD = data?.find(
        ({ detailId }: { detailId: string }) => detailId !== null
      );
      setHasDetails(hasD !== undefined);
      setUrl(data[0]?.url);
    }
  }, [data]);

  return (
    <Box data-testid="article-page" sx={styles.wrapper}>
      {error && <AlertComponent />}
      {!isPending && !isFetching && !error && data && (
        <Box data-test="article">
          <Box>
            <ArticleHeader
              id={id}
              aId={aId}
              isAuth={isAuth}
              data={data}
              refetch={() => refetch()}
            />
            <DetailViewWindow
              isAuth={isAuth}
              id={id}
              aid={aId}
              data={data}
              refetchCallback={() => refetch()}
              hasDetails={hasDetails}
              url={url}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const styles = {
  wrapper: {
    height: "100%",
  },
};

export default Article;
