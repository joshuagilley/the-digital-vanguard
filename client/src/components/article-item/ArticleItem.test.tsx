import { render, screen } from "@testing-library/react";
import ArticleItem from "./ArticleItem";

describe("Home Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<ArticleItem text="hello world" image_url="www.google.com" />);
    const textElement = screen.getByText("hello world");
    expect(textElement).toBeInTheDocument();
  });
});
