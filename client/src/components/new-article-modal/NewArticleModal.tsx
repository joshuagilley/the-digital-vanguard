import { AddIcon } from "@chakra-ui/icons";
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
  Input,
  Textarea,
  useToast,
  Box,
} from "@chakra-ui/react";
import { QueryObserverResult } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { OverlayOne } from "utils/component-utils";
import { isFirstDigitTwo } from "utils/general";

type Props = {
  isHovering: boolean;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
};

const NewArticleModal = ({ isHovering, refetch }: Props) => {
  const { id } = useParams();
  const toast = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [articleName, setArticleName] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [tag, setTag] = useState("");

  const invalidUrl = () => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(articleUrl)) {
      toast({
        title: "Error",
        description: "Invalid Youtube URL.",
        status: "error",
        isClosable: true,
        position: "top",
      });
    }

    return !youtubeRegex.test(articleUrl);
  };

  const hasMissingInputs = () => {
    if (
      articleName === "" ||
      articleSummary === "" ||
      articleUrl === "" ||
      tag === ""
    ) {
      toast({
        title: "Warning",
        description: "All inputs are required.",
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    return (
      articleName === "" ||
      articleSummary === "" ||
      articleUrl === "" ||
      tag === ""
    );
  };

  const onSubmit = async () => {
    if (invalidUrl()) {
      return;
    }
    if (hasMissingInputs()) {
      return;
    }
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleName,
          articleSummary,
          articleUrl,
          tag,
        }),
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

  const openModal = (e: React.MouseEvent) => {
    setOverlay(<OverlayOne />);
    onOpen();
    e.stopPropagation();
  };

  return (
    <Box data-testid="new-article-modal">
      <AddIcon
        data-testid="create"
        sx={styles.addIcon}
        color={isHovering ? "brand.100" : "brand.200"}
        onClick={openModal}
      />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>{t("newArticleModal.create")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("newArticleModal.title")}</FormLabel>
              <Input
                data-testid="name"
                onChange={(e) => setArticleName(e.target.value)}
              />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("newArticleModal.url")}</FormLabel>
              <Input
                data-testid="url"
                placeholder={t("newArticleModal.urlPlaceholder")}
                onChange={(e) => setArticleUrl(e.target.value)}
              />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("newArticleModal.tag")}</FormLabel>
              <Input
                data-testid="tag"
                placeholder="i.e. Full-stack Development"
                onChange={(e) => setTag(e.target.value)}
              />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("newArticleModal.summary")}</FormLabel>
              <Textarea
                data-testid="summary"
                onChange={(e) => setArticleSummary(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button data-testid="submit" onClick={onSubmit}>
              {t("newArticleModal.submit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NewArticleModal;

const styles = {
  input: {
    mt: "20px",
  },
  addIcon: {
    fontSize: "30px",
    mt: "10px",
  },
};
