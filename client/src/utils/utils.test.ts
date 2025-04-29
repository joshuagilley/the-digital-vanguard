import { isFirstDigitTwo, readFileAsync, rankTagsInString } from "./general";
import {
  validateEmail,
  gatherMissingEmailRequirements,
} from "./email-utilities";

describe("general utility functions", () => {
  it("validates email addresses correctly", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
    expect(validateEmail("user@domain")).toBe(false);
    expect(validateEmail("user@domain.com")).toBe(true);
  });

  it("checks if the first digit of a number is 2", () => {
    expect(isFirstDigitTwo(234)).toBe(true);
    expect(isFirstDigitTwo(123)).toBe(false);
    expect(isFirstDigitTwo(2)).toBe(true);
  });

  it("reads a file asynchronously", async () => {
    const mockFile = new File(["Hello, world!"], "test.txt", {
      type: "text/plain",
    });

    const result = await readFileAsync(mockFile);
    expect(result).toBe("Hello, world!");
  });

  it("ranks tags in a string correctly", () => {
    const text = "JavaScript is great. I love JavaScript and TypeScript.";
    const tags = ["JavaScript", "TypeScript", "Python"];
    const rankedTags = rankTagsInString(text, tags);

    expect(rankedTags).toEqual(["javascript", "typescript"]);
  });

  it("returns an empty array when no tags match", () => {
    const text = "This is a random text.";
    const tags = ["JavaScript", "TypeScript"];
    const rankedTags = rankTagsInString(text, tags);

    expect(rankedTags).toEqual(["javascript", "typescript"]);
  });
});

describe("gatherMissingEmailRequirements", () => {
  it("returns missing fields when some fields are empty", () => {
    const emailProps = {
      name: "",
      email: "test@example.com",
      linkedIn: "",
      github: "https://github.com/test",
      message: "",
    };

    const result = gatherMissingEmailRequirements(emailProps);

    expect(result).toBe("Full Name |LinkedIn |Tell us about you |");
  });

  it("returns an empty string when all fields are filled", () => {
    const emailProps = {
      name: "John Doe",
      email: "test@example.com",
      linkedIn: "https://linkedin.com/in/test",
      github: "https://github.com/test",
      message: "Hello, this is a test message.",
    };

    const result = gatherMissingEmailRequirements(emailProps);

    expect(result).toBe("");
  });

  it("handles an empty object gracefully", () => {
    const emailProps = {
      name: "",
      email: "",
      linkedIn: "",
      github: "",
      message: "",
    };

    const result = gatherMissingEmailRequirements(emailProps);

    expect(result).toBe(
      "Full Name |Email |LinkedIn |Github |Tell us about you |"
    );
  });
});
