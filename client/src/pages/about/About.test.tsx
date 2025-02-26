import { render, screen } from "@testing-library/react";
import About from "pages/about";
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
    render(<About />);
    const textElement = screen.getByText("about.vision");
    expect(textElement).toBeInTheDocument();
  });
});
