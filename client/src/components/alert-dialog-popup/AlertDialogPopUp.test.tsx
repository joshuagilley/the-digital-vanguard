import { render, screen } from "@testing-library/react";
import AlertDialogPopUp from "./AlertDialogPopUp";
import { vi } from "vitest";

describe("Navigation Bar testing suite", () => {
  const apiCall = vi.fn(async () => {});
  test("All text and buttons are showing as expected", () => {
    render(<AlertDialogPopUp deleteText="Delete" apiCall={apiCall} />);
    expect(screen.getByText("Delete File")).toBeInTheDocument();
  });
});
