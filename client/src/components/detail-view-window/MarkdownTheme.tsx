import { Heading, Code } from "@chakra-ui/react";

const MarkdownTheme = {
  h1: (props: any) => (
    <Heading as="h1" size="lg" mt={4} mb={2} color="gray.300">
      {props.children}
    </Heading>
  ),
  h2: (props: any) => (
    <Heading as="h2" size="md" mt={3} mb={2} color="gray.300">
      {props.children}
    </Heading>
  ),
  h3: (props: any) => (
    <Heading as="h3" size="sm" mt={2} mb={2} color="gray.300">
      {props.children}
    </Heading>
  ),
  code: ({ inline, children }: any) => {
    if (inline) {
      return (
        <Code fontSize="sm" p="1" borderRadius="md">
          {children}
        </Code>
      );
    }

    return (
      <Code
        backgroundColor="brand.200"
        color="brand.700"
        m="auto"
        fontSize="sm"
      >
        {children}
      </Code>
    );
  },
};

export default MarkdownTheme;
