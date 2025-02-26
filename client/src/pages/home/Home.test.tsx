import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { data } from "mock/article";
import Home from "pages/home";
import { Mock, vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in tests
    },
  },
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe("Home Page", () => {
  test("renders error page", () => {
    const mockUseQuery = vi.mocked(useQuery);
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: false,
      error: true,
      data: undefined,
      isFetching: false,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  test("renders skeleton for isPending", () => {
    const mockUseQuery = vi.mocked(useQuery);
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: true,
      error: null,
      data: undefined,
      isFetching: true,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("renders article page", () => {
    const mockUseQuery = vi.mocked(useQuery);
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: false,
      error: null,
      data: [data],
      isFetching: false,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
