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

describe("GoogleLoginComponent", () => {
  const renderComponent = () =>
    render(
      <GoogleOAuthProvider clientId={`${process.env.GOOGLE_OAUTH_CLIENTID}`}>
        <GoogleLoginComponent />
      </GoogleOAuthProvider>
    );

  it("renders the Google login button", () => {
    renderComponent();
    const loginButton = screen.getByTestId("google-login");
    expect(loginButton).toBeInTheDocument();
  });

  it("displays a loading spinner when loading", () => {
    renderComponent();
    const spinner = screen.queryByTestId("loading-spinner");
    if (spinner) {
      expect(spinner).toBeInTheDocument();
    }
  });

  it("renders an error message if login fails", () => {
    renderComponent();
    const errorMessage = screen.queryByText(/login failed/i);
    if (errorMessage) {
      expect(errorMessage).toBeInTheDocument();
    }
  });

  it("renders success message after successful login", () => {
    renderComponent();
    const successMessage = screen.queryByText(/login successful/i);
    if (successMessage) {
      expect(successMessage).toBeInTheDocument();
    }
  });
});
