import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import NewArticleModal from "./NewArticleModal";
import { Mock, vi } from "vitest";
import { useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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
  };
});

// Here we tell Vitest to mock fetch on the `window` object.
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as Mock;

const useQuery = vi
  .fn()
  .mockResolvedValue({ data: {}, isLoading: false, error: {}, refetch: {} });

(useParams as Mock).mockResolvedValue({
  id: process.env.TEST_USER_ID,
});

describe("New Article Modal", () => {
  it("renders Article Item with correct text", () => {
    const { result } = renderHook(() =>
      useQuery({ queryKey: [], queryFn: () => Promise.resolve() })
    );
    render(
      <NewArticleModal isHovering={true} refetch={result.current.refetch} />
    );
    const textElement = screen.getByTestId("new-article-modal");
    expect(textElement).toBeInTheDocument();
  });

  it("submit new article", () => {
    const { result } = renderHook(() =>
      useQuery({ queryKey: [], queryFn: () => Promise.resolve() })
    );
    render(
      <NewArticleModal isHovering={true} refetch={result.current.refetch} />
    );
    const textElement = screen.getByTestId("new-article-modal");
    expect(textElement).toBeInTheDocument();
  });

  it("test editable inputs", async () => {
    const { result } = renderHook(() =>
      useQuery({ queryKey: [], queryFn: () => Promise.resolve() })
    );
    render(
      <NewArticleModal isHovering={true} refetch={result.current.refetch} />
    );

    fireEvent.click(screen.getByTestId("create"));
    const name = screen.getByTestId("name");
    await userEvent.type(name, "new name{enter}");
    const url = screen.getByTestId("url");
    await userEvent.type(url, `${process.env.TEST_URL}{enter}`);
    const tag = screen.getByTestId("tag");
    await userEvent.type(tag, "new tag{enter}");
    const summary = screen.getByTestId("tag");
    await userEvent.type(summary, "new summary{enter}");
    fireEvent.click(screen.getByTestId("submit"));

    await waitFor(() => {
      expect(screen.getByTestId("submit")).toBeVisible();
    });
  });
});
