import { InputRightElement } from '@chakra-ui/react';
import React from 'react';

import { TokenBalance } from '@/lib/graphql';

export function TokenDescriptor({
  tokenBalance,
}: {
  tokenBalance: TokenBalance | undefined;
}) {
  if (!tokenBalance) return null;

  return (
    <InputRightElement w="3.5rem" color="yellow">
      {tokenBalance?.symbol}
    </InputRightElement>
  );
}
