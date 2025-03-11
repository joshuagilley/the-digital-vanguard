import { PlusSquareIcon } from "@chakra-ui/icons";
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
import { useAuth } from "hooks/auth";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { OverlayOne } from "utils/component-utils";
import { isFirstDigitTwo, readFileAsync } from "utils/general";

type Props = {
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  sortValue: number;
};

const AddDetailModal = ({ refetch, sortValue }: Props) => {
  const { id, aId } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [markdownText, setMarkdownText] = useState("");
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const getAuth = async () => {
    const credential = localStorage.getItem("googleCredential") || "";
    const r = await fetch(`/api/auth/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer: ${credential}` },
    });
    return r;
  };

  const { data: authData } = useAuth(getAuth, []) as any;

  useEffect(() => {
    if (isAuth === null && authData) {
      setIsAuth(authData.status === 200);
    }
  });

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
      const res = await fetch(`/api/users/${id}/articles/${aId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${credential || ""}`,
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
    setOverlay(<OverlayOne />);
    onOpen();
  };

  return (
    <Box data-testid="add-detail-modal">
      {isAuth && (
        <PlusSquareIcon
          data-testid={"add-detail"}
          sx={styles.addDetail}
          onClick={handleAddDetail}
        />
      )}
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

export default AddDetailModal;

const styles = {
  input: {
    mt: "20px",
  },
  addDetail: {
    mr: "10px",
    fontSize: "18px",
    cursor: "pointer",
    color: "brand.300",
    _hover: {
      color: "brand.200",
    },
  },
};
