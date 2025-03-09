import { render, screen } from "@testing-library/react";
import App from "./App";
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

describe("App.tsx testing suite", () => {
  it("App loads with home page displayed", () => {
    render(<App />);
    const textElement = screen.getByTestId("home-page");
    expect(textElement).toBeInTheDocument();
  });
});
