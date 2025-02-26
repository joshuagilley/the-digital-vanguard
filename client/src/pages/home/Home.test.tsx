import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import HomePage from "pages/home";
import { vi } from "vitest";

describe("Home Page", () => {
  vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
      ...actual,
      useParams: vi.fn(),
      useNavigate: vi.fn(),
    };
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
      },
    },
  });
  test("renders ExampleComponent with correct text", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    );
    const textElement = screen.getByTestId("home-page");
    expect(textElement).toBeInTheDocument();
  });
});
