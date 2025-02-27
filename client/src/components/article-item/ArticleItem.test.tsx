import { render, screen } from "@testing-library/react";
import ArticleItem from "./ArticleItem";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe("Article Item Page", () => {
  test("renders Article Item with correct text", () => {
    render(
      <BrowserRouter>
        <ArticleItem
          text="hello world"
          imageUrl="www.google.com"
          userId=""
          articleId=""
        />
      </BrowserRouter>
    );
    const textElement = screen.getByText("hello world");
    expect(textElement).toBeInTheDocument();
  });
});
