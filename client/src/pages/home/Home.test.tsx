import { render, screen } from "@testing-library/react";
import HomePage from "pages/home";

describe("Home Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<HomePage />);
    const textElement = screen.getByTestId("home-page");
    expect(textElement).toBeInTheDocument();
  });
});
