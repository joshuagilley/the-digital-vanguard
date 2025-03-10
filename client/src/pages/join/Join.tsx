"use client";

import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Status } from "types/user";
import { handleSubmit, validateEmail } from "utils/email-utilities";
import { isMobile } from "react-device-detect";

const Join = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleToast = (
    title: string,
    description: string,
    status: Status,
    duration: number
  ) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <Container centerContent sx={styles.container}>
      <Box sx={styles.wrapper}>
        <Box sx={styles.formWrapper}>
          <Box>
            <Heading>{t("joinPage.join")}</Heading>
            <Text sx={styles.fillOut}>{t("joinPage.fillOut")}</Text>
          </Box>
          <Box sx={styles.formPadding}>
            <Box m={8}>
              <VStack spacing={5}>
                <FormControl id="name">
                  <FormLabel>{t("joinPage.fullName")}</FormLabel>
                  <Input
                    focusBorderColor="#e0ceb5"
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    size="md"
                  />
                </FormControl>
                <FormControl id="name">
                  <FormLabel>{t("joinPage.email")}</FormLabel>
                  <Input
                    focusBorderColor="brand.300"
                    onChange={(e) => handleEmailChange(e.target.value)}
                    type="text"
                    size="md"
                  />
                </FormControl>
                <FormControl id="name">
                  <Flex>
                    <FormLabel mr={1}>{t("joinPage.linkedIn")}</FormLabel>
                    <Image
                      sx={styles.linkedIn}
                      src={t("joinPage.linkedInImage")}
                    />
                  </Flex>
                  <Input
                    focusBorderColor="brand.300"
                    onChange={(e) => setLinkedIn(e.target.value)}
                    type="text"
                    size="md"
                  />
                </FormControl>
                <FormControl id="name">
                  <Flex>
                    <FormLabel mr={1}>{t("joinPage.github")}</FormLabel>
                    <Image
                      m={0}
                      w={5}
                      height={5}
                      src={t("joinPage.githubImage")}
                    />
                  </Flex>
                  <Input
                    focusBorderColor="brand.300"
                    onChange={(e) => setGithub(e.target.value)}
                    type="text"
                    size="md"
                  />
                </FormControl>
                <FormControl id="name">
                  <FormLabel>{t("joinPage.tellUs")}</FormLabel>
                  <Textarea
                    focusBorderColor="brand.300"
                    onChange={(e) => setMessage(e.target.value)}
                    borderColor="gray.300"
                    _hover={{
                      borderRadius: "gray.300",
                    }}
                    placeholder="message"
                  />
                </FormControl>
                <FormControl id="name" float="right">
                  <Button
                    onClick={() =>
                      handleSubmit(
                        name,
                        email,
                        linkedIn,
                        github,
                        message,
                        isValid,
                        handleToast
                      )
                    }
                    variant="solid"
                    colorScheme="whiteAlpha"
                  >
                    {t("joinPage.submit")}
                  </Button>
                </FormControl>
              </VStack>
            </Box>
            <Text m={"18px"} color="brand.200">
              {t("joinPage.manualVerification")}
            </Text>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Join;

const styles = {
  container: {
    maxWidth: "full",
    overflow: "hidden",
  },
  wrapper: {
    color: "#f0f6fc",
    borderRadius: "lg",
    m: { sm: 4, md: 16, lg: 10 },
    p: { sm: 5, md: 5, lg: 10 },
    w: isMobile ? "100%" : "50%",
  },
  formWrapper: {
    w: "100%",
    m: "auto",
  },
  fillOut: {
    mt: { sm: 3, md: 3, lg: 5 },
    color: "gray.500",
  },
  formPadding: {
    backgroundColor: "#18181a",
    borderRadius: "lg",
    p: 1,
    mt: 5,
  },
  linkedIn: {
    w: 5,
    h: 5,
  },
};
