// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { render } from "@testing-library/react";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: false, // Disable retries in tests
//     },
//   },
// });

// const AllTheProviders = ({ children }) => {
//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };

// const customRender = (ui, options) =>
//   render(ui, { wrapper: AllTheProviders, ...options });

// export * from "@testing-library/react";
// export { customRender as render, queryClient };
