import { DeleteIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  Button,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialog,
  Box,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  deleteText: string;
  apiCall: () => Promise<void>;
};

const AlertDialogPopUp = ({ deleteText, apiCall }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const cancelRef = useRef(null);
  const handleDelete = () => {
    apiCall();
    onClose();
  };

  return (
    <Box>
      <DeleteIcon
        sx={styles.deleteFile}
        data-testid="delete-article"
        onClick={onOpen}
      >
        {t("alertDialogPopup.deleteFile")}
      </DeleteIcon>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader sx={styles.deleteText}>
              {deleteText}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t("alertDialogPopup.areYouSure")}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("alertDialogPopup.cancel")}
              </Button>
              <Button
                data-testid="delete"
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
              >
                {t("alertDialogPopup.delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default AlertDialogPopUp;

const styles = {
  deleteFile: {
    fontSize: "20px",
    cursor: "pointer",
    color: "brand.600",
    _hover: {
      color: "brand.200",
    },
  },
  deleteText: {
    fontSize: "lg",
    fontWeight: "bold",
  },
};
