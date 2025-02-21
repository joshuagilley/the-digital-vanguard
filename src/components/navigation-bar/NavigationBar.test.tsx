import { render, screen } from "@testing-library/react";
import { ABOUT, CONTACT, HOME, TDV } from "assets/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavigationBar from "components/navigation-bar";
import { BrowserRouter } from "react-router-dom";

describe("Navigation Bar testing suite", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
      },
    },
  });
  test("All text and buttons are showing as expected", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NavigationBar />
        </BrowserRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(TDV)).toBeInTheDocument();
    expect(screen.getByText(HOME)).toBeInTheDocument();
    expect(screen.getByText(ABOUT)).toBeInTheDocument();
    expect(screen.getByText(CONTACT)).toBeInTheDocument();
  });
});
