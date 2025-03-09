import { render, screen } from "@testing-library/react";
import Join from "pages/join";
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

describe("Join Page", () => {
  it("renders ExampleComponent with correct text", () => {
    render(<Join />);
    const textElement = screen.getByText("joinPage.join");
    expect(textElement).toBeInTheDocument();
  });
});
