import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App.tsx testing suite", () => {
  test("App loads with home page displayed", () => {
    render(<App />);
    const textElement = screen.getByTestId("home-page");
    expect(textElement).toBeInTheDocument();
  });
});
