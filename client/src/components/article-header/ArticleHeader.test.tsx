import { waitFor, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { headerData } from "mock/article";
import ArticleHeader from "./ArticleHeader";
import { Mock, vi } from "vitest";
import { useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

(useParams as Mock).mockReturnValue({
  id: process.env.TEST_USER_ID,
  aId: process.env.TEST_ARTICLE_ID,
});

it("test editable inputs", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ArticleHeader
        id={"9367cbee-9f32-4d8b-b375-fc1af17f3a62"}
        aId={"a0db8bd4-afb2-40b8-a28d-9d53101fe86d"}
        isAuth={true}
        hasDetails={true}
        data={headerData}
        refetch={() => console.log("refetching")}
      />
    </QueryClientProvider>
  );

  const nameInput = screen.getByTestId("editable-input-name").children[1];
  const summaryInput = screen.getByTestId("editable-input-summary").children[1];
  await userEvent.type(nameInput, "new name{enter}");
  await userEvent.type(summaryInput, "new summary{enter}");
  await waitFor(() => {
    expect(screen.getByTestId("editable-input-name")).toBeInTheDocument();
    expect(screen.getByTestId("editable-input-summary")).toBeInTheDocument();
  });
});
