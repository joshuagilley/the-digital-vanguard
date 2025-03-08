/* eslint-disable no-unused-vars */
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { t } from "i18next";
import { Dispatch, SetStateAction } from "react";

export const AlertComponent = () => {
  return (
    <Alert status="error" data-testid="error">
      <AlertIcon />
      <AlertTitle>{t("portfolio.userDataFetchFail")}</AlertTitle>
      <AlertDescription>{t("portfolio.tryAgain")}</AlertDescription>
    </Alert>
  );
};

export const SkeletonComponent = () => {
  return (
    <Stack data-testid="skeleton">
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  );
};
