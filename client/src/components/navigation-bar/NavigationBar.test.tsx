import { render, screen } from "@testing-library/react";
import NavigationBar from "components/navigation-bar";
import { BrowserRouter } from "react-router-dom";

describe("Navigation Bar testing suite", () => {
  test("All text and buttons are showing as expected", () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );
    expect(screen.getByTestId("hamburger")).toBeInTheDocument();
  });
});
