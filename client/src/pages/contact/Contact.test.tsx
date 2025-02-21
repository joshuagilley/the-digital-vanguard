import { render, screen } from "@testing-library/react";
import Contact from "pages/contact";

describe("Contact Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<Contact />);
    const textElement = screen.getByText("Contact");
    expect(textElement).toBeInTheDocument();
  });
});
