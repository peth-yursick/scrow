import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { ChakraNextLink, useMediaStyles } from '@scrow/ui';
import React from 'react';

// Disable static generation as this page uses hooks that require WagmiProvider
export const getServerSideProps = () => ({
  props: {},
});

function Home() {
  const { primaryButtonSize } = useMediaStyles();

  return (
    <Flex direction="column" align="center" justify="center" gap={6}>
      <Heading
        fontWeight={700}
        fontSize={50}
        textAlign="center"
        color="text"
      >
        Welcome to sCrow
      </Heading>

      <Text fontStyle="italic" color="textMuted">
        How do you want to get started?
      </Text>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        columnGap={10}
        rowGap={4}
        width="100%"
        align="center"
        justify="center"
        paddingX={10}
      >
        <ChakraNextLink href="/create">
          <Button size={primaryButtonSize} minW="250px" paddingY={6}>
            Create Invoice
          </Button>
        </ChakraNextLink>

        <ChakraNextLink href="/invoices">
          <Button size={primaryButtonSize} minW="250px" paddingY={6}>
            View Existing Invoices
          </Button>
        </ChakraNextLink>
      </Flex>
    </Flex>
  );
}

export default Home;
