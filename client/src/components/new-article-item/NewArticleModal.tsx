import { PlusSquareIcon, AddIcon } from "@chakra-ui/icons";
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
  const [phrase, setPhrase] = useState("");

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
        phrase,
      }),
    });
    refetch();
    onClose();
  };

  return (
    <>
      <AddIcon
        fontSize="30px"
        mt="20px"
        color={isHovering ? "#f0f6fc" : "#919192"}
        onClick={(e) => {
          setOverlay(<OverlayTwo />);
          onOpen();
          e.stopPropagation();
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
              <Input
                placeholder="Video of your project"
                onChange={(e) => handleArticleUrl(e.target.value)}
              />
            </FormControl>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>Phrase</FormLabel>
              <Input
                placeholder="i.e. Full-stack Development"
                onChange={(e) => setPhrase(e.target.value)}
              />
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
