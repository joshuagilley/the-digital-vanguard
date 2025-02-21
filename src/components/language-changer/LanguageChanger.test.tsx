import { render, screen } from "@testing-library/react";
import LanguageChanger from "components/language-changer";

describe("About Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<LanguageChanger />);
    const textElement = screen.getByText("languages.english");
    expect(textElement).toBeInTheDocument();
  });
});
