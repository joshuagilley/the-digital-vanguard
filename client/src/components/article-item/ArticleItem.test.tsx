import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import ArticleItem from "./ArticleItem";

import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

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

const useQuery = vi
  .fn()
  .mockResolvedValue({ data: {}, isLoading: false, error: {}, refetch: {} });

describe("Article Item Page", () => {
  it("renders Article Item with correct text", () => {
    const { result } = renderHook(() =>
      useQuery({ queryKey: [], queryFn: () => Promise.resolve() })
    );

    render(
      <BrowserRouter>
        <ArticleItem
          text="hello world"
          tag="react.js"
          userId=""
          articleId=""
          refetch={result.current.refetch}
        />
      </BrowserRouter>
    );
    const textElement = screen.getByText("hello world");
    expect(textElement).toBeInTheDocument();
  });

  it("test deleteArticle", async () => {
    const { result } = renderHook(() =>
      useQuery({ queryKey: [], queryFn: () => Promise.resolve() })
    );

    render(
      <BrowserRouter>
        <ArticleItem
          text="hello world"
          tag="react.js"
          userId=""
          articleId=""
          refetch={result.current.refetch}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("delete-article"));
    fireEvent.click(screen.getByTestId("delete"));

    expect(screen.getByTestId("delete")).toBeInTheDocument();
  });
});
