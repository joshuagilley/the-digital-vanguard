import { render, screen } from "@testing-library/react";
import NewArticleModal from "./NewArticleModal";

describe("Article Item Page", () => {
  test("renders Article Item with correct text", () => {
    render(<NewArticleModal isHovering={true} />);
    const textElement = screen.getByTestId("new-article-modal");
    expect(textElement).toBeInTheDocument();
  });
});
