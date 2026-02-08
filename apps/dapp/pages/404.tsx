import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

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
        <Link href="/" passHref legacyBehavior>
          <Button colorScheme="blue" size="lg" as="a">
            Go Home
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
