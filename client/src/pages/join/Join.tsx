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
import { EmailResponse, Status } from "types/user";
import emailjs from "@emailjs/browser";

const Join = () => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState("");

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

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendEmail = async () => {
    var templateParams = {
      name,
      email,
      linkedIn,
      github,
      message,
    };

    emailjs.init({
      publicKey: process.env.EMAIL_PUBLIC_KEY,
    });

    try {
      const response = await emailjs.send(
        process.env.EMAIL_SERVICE_ID || "",
        process.env.EMAIL_TEMPLATE_ID || "",
        templateParams
      );
      return response;
    } catch (error) {
      return error as EmailResponse;
    }
  };

  const handleSubmit = async () => {
    let theFollowingFields = "";
    theFollowingFields += name === "" ? "Full Name |" : "";
    theFollowingFields += email === "" ? "Email |" : "";
    theFollowingFields += linkedIn === "" ? "LinkedIn |" : "";
    theFollowingFields += github === "" ? "Github |" : "";
    theFollowingFields += message === "" ? "Tell us about you |" : "";
    if (!isValid) {
      handleToast("Invalid email..", `You entered "${email}"`, "error", 3000);
    } else if (theFollowingFields !== "") {
      handleToast("Fields missing:", theFollowingFields, "error", 3000);
    } else {
      const { status, text } = await sendEmail();

      if (status === 200) {
        handleToast(
          "Success!",
          "We're looking over your details now and will hear from us soon!",
          "success",
          5000
        );
      } else {
        handleToast("Failed..", text, "error", 5000);
      }
    }
  };

  return (
    <Container maxW="full" centerContent overflow="hidden">
      <Flex>
        <Box
          color="#f0f6fc"
          borderRadius="lg"
          m={{ sm: 4, md: 16, lg: 10 }}
          p={{ sm: 5, md: 5, lg: 10 }}
          w={1000}
        >
          <Box w={600} m={"auto"}>
            <Box>
              <Heading>Join</Heading>
              <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.500">
                Fill out the form to join The Digital Vanguard as a developer
              </Text>
            </Box>
            <Box bg="#18181a" borderRadius="lg" p={1} mt={5}>
              <Box m={8}>
                <VStack spacing={5}>
                  <FormControl id="name">
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      focusBorderColor="#e0ceb5"
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      size="md"
                    />
                  </FormControl>
                  <FormControl id="name">
                    <FormLabel>Email</FormLabel>
                    <Input
                      focusBorderColor="#e0ceb5"
                      onChange={(e) => handleEmailChange(e.target.value)}
                      type="text"
                      size="md"
                    />
                  </FormControl>
                  <FormControl id="name">
                    <Flex>
                      <FormLabel mr={1}>LinkedIn</FormLabel>
                      <Image
                        w={5}
                        height={5}
                        src="https://banner2.cleanpng.com/20180425/caq/ave9k5bbl.webp"
                      />
                    </Flex>
                    <Input
                      focusBorderColor="#e0ceb5"
                      onChange={(e) => setLinkedIn(e.target.value)}
                      type="text"
                      size="md"
                    />
                  </FormControl>
                  <FormControl id="name">
                    <Flex>
                      <FormLabel mr={1}>GitHub</FormLabel>
                      <Image
                        m={0}
                        w={5}
                        height={5}
                        src="https://cdn.freebiesupply.com/logos/large/2x/github-icon-logo-png-transparent.png"
                      />
                    </Flex>
                    <Input
                      focusBorderColor="#e0ceb5"
                      onChange={(e) => setGithub(e.target.value)}
                      type="text"
                      size="md"
                    />
                  </FormControl>
                  <FormControl id="name">
                    <FormLabel>Tell us about you</FormLabel>
                    <Textarea
                      focusBorderColor="#e0ceb5"
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
                      onClick={handleSubmit}
                      variant="solid"
                      colorScheme="whiteAlpha"
                    >
                      {"Submit"}
                    </Button>
                  </FormControl>
                </VStack>
              </Box>
              <Text m={"18px"} color="gray.500">
                {`Note: This is a manual verification process for now, so give a
                few business days to be added to the system.`}
              </Text>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default Join;
