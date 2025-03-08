import { render, screen } from "@testing-library/react";
import Join from "pages/join";

describe("Join Page", () => {
  test("renders ExampleComponent with correct text", () => {
    render(<Join />);
    const textElement = screen.getByText("joinPage.join");
    expect(textElement).toBeInTheDocument();
  });
});
