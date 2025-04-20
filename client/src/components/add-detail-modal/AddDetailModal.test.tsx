import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import AddDetailModal from "./AddDetailModal";
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

describe("Add Detail Modal", () => {
  const { result } = renderHook(() =>
    useQuery({ queryKey: [], queryFn: () => Promise.resolve() })
  );

  const refetchTags = vi.fn();

  it("renders Article Item with correct text", () => {
    render(
      <AddDetailModal
        sortValue={1}
        refetch={result.current.refetch}
        isAuthenticated
        refetchTags={refetchTags}
      />
    );
    const textElement = screen.getByTestId("add-detail-modal");
    expect(textElement).toBeInTheDocument();
  });

  it("test handleAddDetail", async () => {
    render(
      <AddDetailModal
        sortValue={1}
        refetch={result.current.refetch}
        isAuthenticated
        refetchTags={refetchTags}
      />
    );

    fireEvent.click(screen.getAllByTestId("add-detail")[0]);

    await waitFor(() => {
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    });
  });

  it("test onSubmit", async () => {
    vi.mock("utils/general");
    render(
      <AddDetailModal
        sortValue={1}
        refetch={result.current.refetch}
        isAuthenticated
        refetchTags={refetchTags}
      />
    );

    fireEvent.click(screen.getByTestId("add-detail"));

    expect(screen.getByTestId("submit-file")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("submit-file"));

    await waitFor(() => {
      expect(screen.getByTestId("add-detail-modal")).toBeInTheDocument();
    });
  });

  it("simulates file selection", async () => {
    vi.mock("utils/general");
    render(
      <AddDetailModal
        sortValue={1}
        refetch={result.current.refetch}
        isAuthenticated
        refetchTags={refetchTags}
      />
    );
    fireEvent.click(screen.getByTestId("add-detail"));
    const fileInput = screen.getByTestId("file-upload") as HTMLInputElement;
    const mockFile = new File(["markdown content"], "file.md", {
      type: "text/x-markdown",
    });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    await waitFor(() => {
      expect(fileInput).toBeInTheDocument();
    });
  });

  it("trigger error by uploading non markdown file", async () => {
    vi.mock("utils/general");
    render(
      <AddDetailModal
        sortValue={1}
        refetch={result.current.refetch}
        isAuthenticated
        refetchTags={refetchTags}
      />
    );
    fireEvent.click(screen.getByTestId("add-detail"));
    const fileInput = screen.getByTestId("file-upload") as HTMLInputElement;
    const mockFile = new File(["markdown content"], "file.txt", {
      type: "text/x-markdown",
    });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    expect(fileInput).toBeInTheDocument();
  });
});
