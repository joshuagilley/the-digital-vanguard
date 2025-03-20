import { fireEvent, render, screen } from "@testing-library/react";
import { vi, Mock } from "vitest";
import Article from "./Article";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { data } from "mock/article";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in tests
    },
  },
});

// Here we tell Vitest to mock fetch on the `window` object.
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as Mock;

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
  aId: process.env.TEST_ARTICLE_ID,
});

const mockUseQuery = vi.mocked(useQuery);
const mockImplementation = (
  isPending: boolean,
  error: boolean | null,
  isFetching: boolean
) => {
  (mockUseQuery as Mock).mockImplementation(() => ({
    isPending,
    error,
    data,
    isFetching,
    refetch: () => Promise.resolve({}),
  }));
};

describe("Articles Page", () => {
  it("renders error page", () => {
    mockImplementation(false, true, false);
    render(
      <QueryClientProvider client={queryClient}>
        <Article isAuthenticated />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  it("renders article page", () => {
    mockImplementation(false, null, false);
    render(
      <QueryClientProvider client={queryClient}>
        <Article isAuthenticated />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("article-page")).toBeInTheDocument();
  });

  // it("test new url", async () => { THIS WILL MOVE TO MARKDOWN WINDOWN COMPONENT
  //   mockImplementation(false, null, false);
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Article isAuthenticated />
  //     </QueryClientProvider>
  //   );

  //   fireEvent.click(screen.getByTestId("show-demo"));
  //   fireEvent.click(screen.getByTestId("edit-url-icon"));
  //   const urlInput = screen.getByTestId("editable-url").children[1];

  //   await userEvent.type(
  //     urlInput,
  //     "https://www.youtube.com/watch?v=GOIYREEANEM{enter}"
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByTestId("edit-url-icon")).toBeInTheDocument();
  //   });
  // });

  it("article delete", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Article isAuthenticated />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId("delete-article"));
    fireEvent.click(screen.getByTestId("delete"));

    expect(screen.getByTestId("delete")).not.toBeVisible();
  });
});
