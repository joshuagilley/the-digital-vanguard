import { render, screen } from "@testing-library/react";
import AvatarFlip from "./index";

const props = {
  username: "test",
  email: "test@gmail.com",
  avatar: "https://example.com/avatar.jpg",
  isAuth: true,
};

describe("Article Item Page", () => {
  it("renders Article Item with correct text", () => {
    render(<AvatarFlip {...props} />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
  });
});
