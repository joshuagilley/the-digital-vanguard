import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useToast,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { OverlayOne } from "utils/component-utils";
import {
  isFirstDigitTwo,
  rankTagsInString,
  readFileAsync,
} from "utils/general";
import { FilePlus2 } from "lucide-react";

type Props = {
  refetch: () => void;
  refetchTags: () => void;
  sortValue: number;
  isAuthenticated?: boolean;
};

const AddDetailModal = ({
  refetch,
  refetchTags,
  sortValue,
  isAuthenticated,
}: Props) => {
  const { id, aId } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [markdownText, setMarkdownText] = useState("");
  const isAuth =
    isAuthenticated || id === localStorage.getItem("authenticatedId");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      try {
        const ext = files[0].name.split(".")[1];
        if (ext !== "md") {
          throw new Error("Currently only markdown files are accepted..");
        }
        const fileContent = await readFileAsync(files[0]);
        setMarkdownText(String(fileContent));
      } catch (error) {
        const description = error instanceof Error ? error.message : "";
        toast({
          title: "Error",
          description,
          status: "error",
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const handleSendTags = async (
    credential: string,
    newTags: string[],
    tagId: string
  ) => {
    try {
      await fetch(`/api/users/${id}/articles/${aId}/generate-dynamic-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${credential}`,
        },
        body: JSON.stringify({ tags: newTags, tagId }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getExistingTagId = async (aId: string): Promise<string> => {
    const res = await fetch(`/api/articles/${aId}/tags`);
    const tags = await res.json();
    return tags.length > 0 ? tags[0].tag_id : "";
  };

  const getMarkdownText = async (aId: string): Promise<string> => {
    const res = await fetch(`/api/get-markdown/${aId}`);
    const { text } = await res.json();
    return text;
  };

  const retryFetch = async (
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1000
  ): Promise<Response> => {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (res.ok) return res;
        lastError = new Error(`Failed with status: ${res.status}`);
      } catch (err) {
        lastError = err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
    throw lastError;
  };

  const generateTagsFromLambda = async (
    combinedText: string
  ): Promise<string[]> => {
    const res = await retryFetch(process.env.API_GATEWAY_TAG_GENERATOR!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_GATEWAY_KEY!,
      },
      body: JSON.stringify({ text: combinedText }),
    });

    const { tags = [] } = await res.json();
    return tags;
  };

  const updateDynamicTags = async (newText: string) => {
    try {
      const credential = localStorage.getItem("googleCredential");
      const tagId = await getExistingTagId(aId);
      const markdownText = await getMarkdownText(aId);
      const combinedText = `${markdownText} ${newText}`;
      const newTags = await generateTagsFromLambda(combinedText);
      const rankedTags = rankTagsInString(markdownText, newTags);

      await handleSendTags(credential, rankedTags, tagId);
      refetchTags();
    } catch (err) {
      console.error("Error in updateDynamicTags:", err);
    }
  };

  const onSubmit = async () => {
    try {
      const credential = localStorage.getItem("googleCredential");
      const res = await fetch(`/api/users/${id}/articles/${aId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${credential || ""}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markdownText: markdownText.replace(/'/g, "''"),
          sortValue,
        }),
      });
      if (!isFirstDigitTwo(res.status)) {
        throw new Error(`Got ${res.status} at ${res.url}`);
      }
      updateDynamicTags(markdownText.replace(/'/g, "''"));
      refetch();
    } catch (error) {
      const description = error instanceof Error ? error.message : "";
      toast({
        title: "Error",
        description,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
    onClose();
  };

  const handleAddDetail = () => {
    setOverlay(<OverlayOne />);
    onOpen();
  };

  return (
    <Box data-testid="add-detail-modal">
      {isAuth && (
        <Box
          sx={styles.addDetail}
          data-testid={"add-detail"}
          onClick={handleAddDetail}
        >
          <Tooltip label="Add detail">
            <FilePlus2 size={28} />
          </Tooltip>
        </Box>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent sx={{ backgroundColor: "brand.500", color: "brand.100" }}>
          <ModalHeader>{t("addDetailModal.addDetail")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("addDetailModal.uploadMarkdown")}</FormLabel>
              <input
                data-testid="file-upload"
                type="file"
                onChange={handleFileChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              data-testid="submit-file"
              sx={styles.submit}
              onClick={onSubmit}
            >
              {t("addDetailModal.submit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddDetailModal;

const styles = {
  input: {
    mt: "20px",
  },
  addDetail: {
    mr: "10px",
    cursor: "pointer",
    color: "brand.300",
    _hover: {
      color: "brand.200",
    },
  },
  submit: {
    _hover: {
      backgroundColor: "brand.300",
      color: "brand.500",
    },
  },
};
