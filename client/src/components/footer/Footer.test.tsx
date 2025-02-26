import { render, screen } from "@testing-library/react";
import Footer from "components/footer";
import { vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe("About Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<Footer />);
    const textElement = screen.getByText("languages.changeLanguage");
    expect(textElement).toBeInTheDocument();
  });
});
