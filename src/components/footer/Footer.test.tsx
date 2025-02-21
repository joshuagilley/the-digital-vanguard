import { render, screen } from "@testing-library/react";
import Footer from "components/footer";

describe("About Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<Footer />);
    const textElement = screen.getByText("languages.changeLanguage");
    expect(textElement).toBeInTheDocument();
  });
});
