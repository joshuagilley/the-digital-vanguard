import { render, screen } from "@testing-library/react";
import ArticleItem from "./ArticleItem";
import { BrowserRouter } from "react-router-dom";

describe("Home Page", () => {
  test("renders ExampleComponent with correct text", () => {
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
