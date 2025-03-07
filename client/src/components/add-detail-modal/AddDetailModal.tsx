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
} from "@chakra-ui/react";
import { QueryObserverResult } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
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
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  sortValue: number;
};

function readFileAsync(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target?.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file); // Or other read method based on your needs
  });
}

export const AddDetailModal = ({ refetch, sortValue }: Props) => {
  const { aId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [markdownText, setMarkdownText] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      try {
        const fileContent = await readFileAsync(files[0]);
        setMarkdownText(String(fileContent));
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const onSubmit = async () => {
    const res = await fetch(`/api/articles/${aId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markdownText, sortValue }),
    });
    //add a toast here
    console.log(res);
    refetch();
    onClose();
  };

  return (
    <>
      <Button
        onClick={() => {
          setOverlay(<OverlayTwo />);
          onOpen();
        }}
        mr="10px"
        colorScheme="whiteAlpha"
      >
        {"Add Detail File"}
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Add Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl sx={styles.input} isRequired>
              <FormLabel>Upload Markdown File</FormLabel>
              <input type="file" onChange={handleFileChange} />
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
