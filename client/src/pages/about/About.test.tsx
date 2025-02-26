import { render, screen } from "@testing-library/react";
import About from "pages/about";

describe("About Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<About />);
    const textElement = screen.getByText("about.vision");
    expect(textElement).toBeInTheDocument();
  });
});
