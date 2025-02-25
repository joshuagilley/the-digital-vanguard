import { render, screen } from "@testing-library/react";
import { vi, Mock } from "vitest";
import Article from "./Article";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

describe("Articles Page", () => {
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
  test("renders page", () => {
    (useParams as Mock).mockReturnValue({
      id: "********-****-****-****-************",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Article />
      </QueryClientProvider>
    );
    const textElement = screen.getByTestId("article-page");
    expect(textElement).toBeInTheDocument();
  });
});
