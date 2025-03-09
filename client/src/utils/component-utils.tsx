/* eslint-disable no-unused-vars */
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  ModalOverlay,
} from "@chakra-ui/react";
import { t } from "i18next";

export const AlertComponent = () => {
  return (
    <Alert status="error" data-testid="error">
      <AlertIcon />
      <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
      <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
    </Alert>
  );
};

export const OverlayOne = () => (
  <ModalOverlay
    data-testid="modal-overlay"
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);
