import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Portfolio from "./Portfolio";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Mock, vi } from "vitest";
import { useParams } from "react-router-dom";
// import { mock } from "mock/portfolio";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in tests
    },
  },
});
vi.mock("./Porfolio");
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
  id: process.env.TEST_USER_ID,
});

const mockUseQuery = vi.mocked(useQuery);
const mockImplementation = (
  isPending: boolean,
  error: boolean | null,
  isFetching: boolean,
  data?: any[]
) => {
  (mockUseQuery as Mock).mockImplementation(() => ({
    isPending,
    error,
    data,
    isFetching,
    refetch: () => Promise.resolve({}),
  }));
};

describe("Portfolio Page", () => {
  it("renders error page", () => {
    mockImplementation(false, true, false);
    render(
      <QueryClientProvider client={queryClient}>
        <Portfolio isAuthenticated />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  // it("renders portfolio page", () => {
  //   mockImplementation(false, null, false, mock);

  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Portfolio isAuthenticated />
  //     </QueryClientProvider>
  //   );
  //   expect(screen.getByTestId("portfolio-page")).toBeInTheDocument();
  // });

  // it("should trigger email process and reset after timeout", async () => {
  //   mockImplementation(false, null, false, []);
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Portfolio isAuthenticated />
  //     </QueryClientProvider>
  //   );
  //   fireEvent.click(screen.getByTestId("email"));

  //   await waitFor(() => {
  //     expect(screen.getByTestId("email")).toBeDisabled();
  //   });
  // });
});
