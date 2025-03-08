import { render, screen } from "@testing-library/react";
import NewArticleItem from "./NewArticleItem";
describe("Article Item Page", () => {
  test("renders Article Item with correct text", () => {
    render(<NewArticleItem text={"New Article Item"} />);
    const textElement = screen.getByTestId("new-article-item");
    expect(textElement).toBeInTheDocument();
  });
});
