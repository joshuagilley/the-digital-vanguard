import { render, screen } from "@testing-library/react";
import MarkdownTheme from "./MarkdownTheme";

describe("MarkdownTheme Component", () => {
  it("renders h1 with correct text and styles", () => {
    const H1 = MarkdownTheme.h1;
    render(<H1>Test Heading 1</H1>);
    const heading = screen.getByText("Test Heading 1");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveStyle("color: gray.300");
  });

  it("renders h2 with correct text and styles", () => {
    const H2 = MarkdownTheme.h2;
    render(<H2>Test Heading 2</H2>);
    const heading = screen.getByText("Test Heading 2");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveStyle("color: gray.300");
  });

  it("renders inline code with correct styles", () => {
    const Code = MarkdownTheme.code;
    render(<Code inline>Inline Code</Code>);
    const code = screen.getByText("Inline Code");
    expect(code).toBeInTheDocument();
    expect(code.tagName).toBe("CODE");
    expect(code).toHaveStyle("font-size: sm");
  });

  it("renders block code with correct styles", () => {
    const Code = MarkdownTheme.code;
    render(<Code>Block Code</Code>);
    const code = screen.getByText("Block Code");
    expect(code).toBeInTheDocument();
    expect(code.tagName).toBe("CODE");
    expect(code).toHaveStyle("background-color: rgb(0, 0, 0, 0)");
  });
});
