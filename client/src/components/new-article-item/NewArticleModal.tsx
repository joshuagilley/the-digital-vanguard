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
import { OverlayOne, OverlayTwo } from "utils/component-utils";
import { isFirstDigitTwo } from "utils/general";

type Props = {
  isHovering: boolean;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
};

export const NewArticleModal = ({ isHovering, refetch }: Props) => {
  const { id } = useParams();
  const toast = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [articleName, setArticleName] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [phrase, setPhrase] = useState("");

  const handleArticleUrl = (url: string) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    if (youtubeRegex.test(url)) {
      setArticleUrl(url);
    }
  };

  const onSubmit = async () => {
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
          phrase,
        }),
      });
      if (!isFirstDigitTwo(res.status)) {
        throw Error;
      }
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: JSON.stringify(error),
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
    onClose();
  };

  const openModal = (e: React.MouseEvent) => {
    setOverlay(<OverlayTwo />);
    onOpen();
    e.stopPropagation();
  };

  return (
    <Box>
      <AddIcon
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
              <Input onChange={(e) => setArticleName(e.target.value)} />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("newArticleModal.url")}</FormLabel>
              <Input
                placeholder={t("newArticleModal.urlPlaceholder")}
                onChange={(e) => handleArticleUrl(e.target.value)}
              />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("newArticleModal.tag")}</FormLabel>
              <Input
                placeholder="i.e. Full-stack Development"
                onChange={(e) => setPhrase(e.target.value)}
              />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>{t("newArticleModal.summary")}</FormLabel>
              <Textarea onChange={(e) => setArticleSummary(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSubmit}>{t("newArticleModal.submit")}</Button>
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
  addIcon: {
    fontSize: "30px",
    mt: "20px",
  },
};
