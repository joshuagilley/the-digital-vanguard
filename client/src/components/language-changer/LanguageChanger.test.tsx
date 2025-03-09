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

describe("Language Changer", () => {
  it("renders Language Changer with correct text", () => {
    render(<LanguageChanger />);
    const textElement = screen.getByText("languages.english");
    expect(textElement).toBeInTheDocument();
  });
});
