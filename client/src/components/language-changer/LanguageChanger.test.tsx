import { render, screen } from "@testing-library/react";
import LanguageChanger from "components/language-changer";
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
    render(<LanguageChanger />);
    const textElement = screen.getByText("languages.english");
    expect(textElement).toBeInTheDocument();
  });
});
