import { render, screen } from "@testing-library/react";
import AlertDialogPopUp from "./AlertDialogPopUp";
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

describe("Navigation Bar testing suite", () => {
  const apiCall = vi.fn(async () => {});
  it("All text and buttons are showing as expected", () => {
    render(<AlertDialogPopUp deleteText="Delete" apiCall={apiCall} />);
    expect(screen.getByText("alertDialogPopup.deleteFile")).toBeInTheDocument();
  });
});
