import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { useChainId } from 'wagmi';

import { useSubgraphHealth } from '@scrow/hooks';
import { getChainName } from '@scrow/utils';

export const SubgraphHealthAlert: React.FC<{ chainId?: number }> = ({
  chainId,
}) => {
  const currentChainId = useChainId();
  const { health, error, isLoading } = useSubgraphHealth();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching subgraph health: ', error);
  }

  if (isLoading) {
    return null;
  }

  if (!health) {
    return null;
  }

  const hasErrors = health.hasIndexingErrors;
  const notSynced = !health.hasSynced;

  if (!(hasErrors || notSynced)) {
    return null;
  }

  // Use the provided chainId or fall back to current chain
  const alertChainId = chainId ?? currentChainId;
  const chainName = getChainName(alertChainId);

  return (
    <Flex
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      justifyContent="center"
      alignItems="center"
      zIndex={10}
      boxShadow="0px -2px 16px rgba(0, 0, 0, 0.05)"
    >
      <Alert status="error" flexDirection="column" textAlign="center" gap={2}>
        <HStack spacing={0}>
          <AlertIcon />
          <AlertTitle>Data Sync Issue Detected!</AlertTitle>
        </HStack>
        <AlertDescription>
          The subgraph is behind on: {chainName}. Some data may be outdated or
          incomplete. Please try again later.
        </AlertDescription>
      </Alert>
    </Flex>
  );
};
