import { render, renderHook, screen } from "@testing-library/react";
import NewArticleItem from "./NewArticleItem";
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

describe("New Article Item", () => {
  it("renders Article Item with correct text", () => {
    const { result } = renderHook(() =>
      useQuery({ queryKey: [], queryFn: () => Promise.resolve() })
    );

    render(
      <NewArticleItem
        text={"New Article Item"}
        refetch={result.current.refetch}
      />
    );
    const textElement = screen.getByTestId("new-article-item");
    expect(textElement).toBeInTheDocument();
  });
});
