import { fireEvent, render, screen } from "@testing-library/react";
import { HOME } from "assets/constants";
import NavigationBar from "components/navigation-bar";
import { BrowserRouter } from "react-router-dom";

describe("Navigation Bar testing suite", () => {
  it("All text and buttons are showing as expected", () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );
    expect(screen.getByTestId("hamburger")).toBeInTheDocument();
  });

  it("Open hamburger menu", () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("hamburger"));
    expect(screen.getByText(HOME)).toBeInTheDocument();
  });
});
