import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  ModalOverlay,
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
} from "@chakra-ui/react";
import { QueryObserverResult } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const OverlayTwo = () => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="80%"
    backdropBlur="2px"
  />
);

type Props = {
  isHovering: boolean;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
};

export const NewArticleModal = ({ isHovering, refetch }: Props) => {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [articleName, setArticleName] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleUrl, setArticleUrl] = useState("");

  const handleArticleUrl = (url: string) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    if (youtubeRegex.test(url)) {
      setArticleUrl(url);
    }
  };
  const onSubmit = async () => {
    // need a try catch to handle errors on the backend
    await fetch(`/api/users/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleName,
        articleSummary,
        articleUrl,
      }),
    });
    refetch();
    onClose();
  };

  return (
    <>
      <PlusSquareIcon
        fontSize="90px"
        color={isHovering ? "gray.600" : "gray.400"}
        onClick={() => {
          setOverlay(<OverlayTwo />);
          onOpen();
        }}
      />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Create New Article</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>Article title</FormLabel>
              <Input onChange={(e) => setArticleName(e.target.value)} />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>Youtube URL</FormLabel>
              <Input onChange={(e) => handleArticleUrl(e.target.value)} />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>Summary</FormLabel>
              <Textarea onChange={(e) => setArticleSummary(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const styles = {
  input: {
    mt: "20px",
  },
};
