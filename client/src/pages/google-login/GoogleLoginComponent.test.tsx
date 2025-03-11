import { render, screen } from "@testing-library/react";
import GoogleLoginComponent from "./GoogleLoginComponent";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { vi } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

describe("Home Page", () => {
  it("renders error page", () => {
    render(
      <GoogleOAuthProvider clientId={`${process.env.GOOGLE_OAUTH_CLIENTID}`}>
        <GoogleLoginComponent />
      </GoogleOAuthProvider>
    );
    expect(screen.getByTestId("google-login")).toBeInTheDocument();
  });
});
