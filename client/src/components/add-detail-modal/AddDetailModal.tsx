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
} from "@chakra-ui/react";
import { QueryObserverResult } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { OverlayOne, OverlayTwo } from "utils/component-utils";
import { isFirstDigitTwo, readFileAsync } from "utils/general";

type Props = {
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  sortValue: number;
};

export const AddDetailModal = ({ refetch, sortValue }: Props) => {
  const { aId } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [markdownText, setMarkdownText] = useState("");

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
      const res = await fetch(`/api/articles/${aId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdownText, sortValue }),
      });
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

  const handleAddDetail = () => {
    setOverlay(<OverlayTwo />);
    onOpen();
  };

  return (
    <Box data-testid="add-detail-modal">
      <Button
        data-testid={"add-detail"}
        sx={styles.addDetail}
        onClick={handleAddDetail}
        colorScheme="whiteAlpha"
      >
        {"Add Detail File"}
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
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
            <Button data-testid="submit-file" onClick={onSubmit}>
              {t("addDetailModal.submit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const styles = {
  input: {
    mt: "20px",
  },
  addDetail: {
    mr: "10px",
  },
};
