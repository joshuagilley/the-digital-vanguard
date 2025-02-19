import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import MyComponent from "./components/MyComponent";
test("renders ExampleComponent with correct text", () => {
  render(
    <ChakraProvider>
      <MyComponent />
    </ChakraProvider>
  );
  const textElement = screen.getByText("Click me");
  expect(textElement).toBeInTheDocument();
});
