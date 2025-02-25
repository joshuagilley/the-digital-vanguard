import { render, screen } from "@testing-library/react";
import Article from "./Article";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Articles Page", () => {
  const mockUsedNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockUsedNavigate,
  }));
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
      },
    },
  });
  test("renders page", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Article />
      </QueryClientProvider>
    );
    const textElement = screen.getByTestId("article-page");
    expect(textElement).toBeInTheDocument();
  });
});
