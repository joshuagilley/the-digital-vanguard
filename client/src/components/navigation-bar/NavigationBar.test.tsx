import { render, screen } from "@testing-library/react";
import { ABOUT, CONTACT, HOME, TDV } from "assets/constants";
import NavigationBar from "components/navigation-bar";
import { BrowserRouter } from "react-router-dom";

describe("Navigation Bar testing suite", () => {
  test("All text and buttons are showing as expected", () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );
    expect(screen.getByText(TDV)).toBeInTheDocument();
    expect(screen.getByText(HOME)).toBeInTheDocument();
    expect(screen.getByText(ABOUT)).toBeInTheDocument();
    expect(screen.getByText(CONTACT)).toBeInTheDocument();
  });
});
