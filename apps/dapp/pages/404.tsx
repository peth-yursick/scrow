import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { ChakraNextLink } from '@scrow/ui';
import React from 'react';

// Disable static generation as this page uses components that require WagmiProvider
export const getServerSideProps = () => ({
  props: {},
});

export default function Custom404() {
  return (
    <Container maxW="container.md" py={20} centerContent>
      <Stack spacing={6} textAlign="center">
        <Heading as="h1" size="3xl" color="text">
          404
        </Heading>
        <Text fontSize="xl" color="textMuted">
          Page not found
        </Text>
        <ChakraNextLink href="/">
          <Button colorScheme="blue" size="lg">
            Go Home
          </Button>
        </ChakraNextLink>
      </Stack>
    </Container>
  );
}
