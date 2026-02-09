import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

// Simplified layout that doesn't use any wagmi-dependent components
// The page content is responsible for its own layout
export function ClientOnlyLayout({ children }: { children: ReactNode }) {
  return (
    <Flex
      position="relative"
      w="100%"
      direction="column"
      justify="center"
      align="center"
      bg="background"
      h="100%"
      minH="100vh"
      overflowX="hidden"
      bgSize="cover"
      color="text"
    >
      <Flex
        flexGrow={1}
        position="relative"
        w="100%"
        direction="column"
        justify="center"
        align="center"
        h="100%"
      >
        {children}
      </Flex>
    </Flex>
  );
}
