import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import type { NextPageContext } from 'next';

export default function Error({ statusCode }: { statusCode?: number }) {
  return (
    <Container maxW="container.md" py={20} centerContent>
      <Stack spacing={6} textAlign="center">
        <Heading as="h1" size="3xl" color="text">
          {statusCode || 'Error'}
        </Heading>
        <Text fontSize="xl" color="textMuted">
          Something went wrong
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

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode;
  return { statusCode };
};
