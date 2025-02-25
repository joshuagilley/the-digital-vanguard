import { render, screen } from "@testing-library/react";
import Portfolio from "./Portfolio";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Portfolio Page", () => {
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
        <Portfolio />
      </QueryClientProvider>
    );
    const textElement = screen.getByTestId("portfolio-page");
    expect(textElement).toBeInTheDocument();
  });
});
