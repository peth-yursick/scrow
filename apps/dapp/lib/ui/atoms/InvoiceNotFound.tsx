import { Stack, Text } from '@chakra-ui/react';

import { Container } from './Container';

export function InvoiceNotFound({ heading }: { heading?: string }) {
  return (
    <Container>
      <Stack
        spacing="1rem"
        background="card"
        borderRadius="1rem"
        align="center"
        w="calc(100% - 2rem)"
        p="2rem"
        maxW="27.5rem"
        mx={4}
        color="text"
      >
        <Text
          fontSize="2xl"
          textAlign="center"
          fontFamily="heading"
          color="text"
        >
          {heading || 'Invoice Not Found'}
        </Text>
      </Stack>
    </Container>
  );
}
