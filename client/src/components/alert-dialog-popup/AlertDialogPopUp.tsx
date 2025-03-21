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
  Tooltip,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  deleteText: string;
  primaryColor: string;
  secondaryColor: string;
  apiCall: () => Promise<void>;
};

const AlertDialogPopUp = ({
  deleteText,
  primaryColor,
  secondaryColor,
  apiCall,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const cancelRef = useRef(null);
  const handleDelete = () => {
    apiCall();
    onClose();
  };

  return (
    <Box>
      <Tooltip label="Delete detail">
        <DeleteIcon
          color={primaryColor}
          _hover={{ color: secondaryColor }}
          sx={styles.deleteFile}
          data-testid="delete-article"
          onClick={onOpen}
        >
          {t("alertDialogPopup.deleteFile")}
        </DeleteIcon>
      </Tooltip>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            sx={{ backgroundColor: "brand.500", color: "brand.100" }}
          >
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
                backgroundColor="brand.300"
                _hover={{ backgroundColor: "brand.200" }}
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
  },
  deleteText: {
    fontSize: "lg",
    fontWeight: "bold",
  },
};
