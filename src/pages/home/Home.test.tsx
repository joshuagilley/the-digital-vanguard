import { render, screen } from "@testing-library/react";
import HomePage from "pages/home";

describe("Home Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<HomePage />);
    const textElement = screen.getByText("Welcome to The Digital Vanguard");
    expect(textElement).toBeInTheDocument();
  });
});
