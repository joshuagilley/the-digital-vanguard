/* eslint-disable no-unused-vars */
import emailjs from "@emailjs/browser";
import { EmailProps, EmailResponse, Status } from "types/user";
import { REQUIRE_EMAIL_PROPERTIES } from "./constants";

const sendEmail = async ({
  name,
  email,
  linkedIn,
  github,
  message,
}: EmailProps) => {
  emailjs.init({
    publicKey: process.env.EMAIL_PUBLIC_KEY,
  });

  try {
    const response = await emailjs.send(
      process.env.EMAIL_SERVICE_ID || "",
      process.env.EMAIL_TEMPLATE_ID || "",
      {
        name,
        email,
        linkedIn,
        github,
        message,
      }
    );
    return response;
  } catch (error) {
    return error as EmailResponse;
  }
};

const gatherMissingEmailRequirements = (requirements: EmailProps) => {
  let requiredFields = "";
  Object.values(requirements).forEach((value, index) => {
    requiredFields +=
      value === "" ? `${REQUIRE_EMAIL_PROPERTIES[index]} |` : "";
  });
  return requiredFields;
};

export const handleSubmit = async (
  name: string,
  email: string,
  linkedIn: string,
  github: string,
  message: string,
  isValid: boolean,
  handleToast: (
    title: string,
    description: string,
    status: Status,
    duration: number
  ) => void
) => {
  const theFollowingFields = gatherMissingEmailRequirements({
    name,
    email,
    linkedIn,
    github,
    message,
  });

  const title = !isValid
    ? "Invalid email.."
    : theFollowingFields !== ""
      ? "Fields missing:"
      : "";
  const description = !isValid
    ? `You entered "${email}"`
    : theFollowingFields !== ""
      ? theFollowingFields
      : "";

  if (title === "" && description === "") {
    const successText =
      "We're looking over your details now and will hear from us soon!";
    const { status, text } = await sendEmail({
      name,
      email,
      linkedIn,
      github,
      message,
    });

    handleToast(
      status === 200 ? "Success!" : "Failed..",
      status === 200 ? successText : text,
      status === 200 ? "success" : "error",
      5000
    );
  } else {
    handleToast(title, description, "error", 3000);
  }
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
