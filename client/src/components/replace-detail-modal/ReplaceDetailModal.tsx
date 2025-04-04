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
import { isFirstDigitTwo, readFileAsync } from "utils/general";
import { Replace } from "lucide-react";

type Props = {
  refetch: () => void;
  sortValue: number;
  detailId: string;
  isAuthenticated?: boolean;
};

const ReplaceDetailModal = ({
  refetch,
  sortValue,
  detailId,
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

  const onSubmit = async () => {
    try {
      const credential = localStorage.getItem("googleCredential");
      const res = await fetch(
        `/api/users/${id}/articles/${aId}/details/${detailId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${credential || ""}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            changeValue: markdownText.replace(/'/g, "''"),
            property: "markdown",
            sortValue,
          }),
        }
      );
      if (!isFirstDigitTwo(res.status)) {
        throw new Error(`Got ${res.status} at ${res.url}`);
      }
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

  const handleReplaceDetail = () => {
    setOverlay(<OverlayOne />);
    onOpen();
  };

  return (
    <Box data-testid="replace-detail-modal">
      {isAuth && (
        <Tooltip label="Replace detail">
          <Box sx={styles.replaceDetail}>
            <Replace
              size={22}
              data-testid={"replace-detail"}
              onClick={handleReplaceDetail}
            />
          </Box>
        </Tooltip>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent sx={{ backgroundColor: "brand.500", color: "brand.100" }}>
          <ModalHeader>{t("replaceDetailModal.replaceDetail")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("replaceDetailModal.uploadMarkdown")}</FormLabel>
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
              {t("replaceDetailModal.submit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReplaceDetailModal;

const styles = {
  input: {
    mt: "20px",
  },
  replaceDetail: {
    ml: "4px",
    mt: "3px",
    cursor: "pointer",
    color: "brand.700",
    _hover: {
      color: "brand.300",
    },
  },
  submit: {
    _hover: {
      backgroundColor: "brand.300",
      color: "brand.500",
    },
  },
};
