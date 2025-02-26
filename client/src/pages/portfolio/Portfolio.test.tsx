import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Portfolio from "./Portfolio";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Mock, vi } from "vitest";
import { data, useParams } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in tests
    },
  },
});

vi.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

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

(useParams as Mock).mockReturnValue({
  id: "********-****-****-****-************",
});

const mockUseQuery = vi.mocked(useQuery);

describe("Portfolio Page", () => {
  test("renders error page", () => {
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: false,
      error: true,
      data: undefined,
      isFetching: false,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Portfolio />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  test("renders skeleton for isPending", () => {
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: true,
      error: null,
      data: undefined,
      isFetching: true,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Portfolio />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("renders article page", () => {
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: false,
      error: null,
      data,
      isFetching: false,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Portfolio />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("portfolio-page")).toBeInTheDocument();
  });

  test("handle call", () => {
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: false,
      error: null,
      data,
      isFetching: false,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Portfolio />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByTestId("phone"));
    waitFor(() => {
      expect(screen.getAllByText("Calling")).toBeInTheDocument();
    });
  });

  test("handle email", () => {
    (mockUseQuery as Mock).mockImplementation(() => ({
      isPending: false,
      error: null,
      data,
      isFetching: false,
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <Portfolio />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByTestId("email"));
    waitFor(() => {
      expect(screen.getAllByText("Emailing")).toBeInTheDocument();
    });
  });
});
