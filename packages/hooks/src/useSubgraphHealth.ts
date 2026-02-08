import {
  NETWORK_CONFIG,
  SupportedChainId,
} from '@scrow/constants';
import { getSubgraphStatus } from '@scrow/graphql';
import { publicClients } from '@scrow/utils';
import useSWR from 'swr';
import { useChainId } from 'wagmi';

const SUBGRAPH_STATUS_UPDATE_INTERVAL = 10000;

const getLatestBlockNumber = async (
  chainId: SupportedChainId,
): Promise<number> => {
  const publicClient = publicClients[chainId];
  if (!publicClient) return 0;
  const blockNumber = await publicClient.getBlockNumber();
  return Number(blockNumber);
};

const getSubgraphHealth = async (
  chainId: SupportedChainId,
): Promise<SubgraphHealth> => {
  const [status, latestBlockNumber] = await Promise.all([
    getSubgraphStatus(chainId),
    getLatestBlockNumber(chainId),
  ]);
  const threshold = NETWORK_CONFIG[chainId].SUBGRAPH_HEALTH_THRESHOLD;
  return {
    hasIndexingErrors: status.hasIndexingErrors,
    hasSynced: status.syncedBlockNumber >= latestBlockNumber - threshold,
  };
};

export type SubgraphHealth = {
  hasIndexingErrors: boolean;
  hasSynced: boolean;
};

export type SubgraphHealthReturnType = {
  health: SubgraphHealth | undefined;
  isLoading: boolean;
  error: Error | null;
};

export const useSubgraphHealth = (): SubgraphHealthReturnType => {
  const chainId = useChainId() as SupportedChainId;

  const { data, error, isValidating, isLoading } = useSWR(
    ['subgraph-status', chainId],
    () => getSubgraphHealth(chainId),
    {
      refreshInterval: SUBGRAPH_STATUS_UPDATE_INTERVAL,
      revalidateOnFocus: false,
      dedupingInterval: SUBGRAPH_STATUS_UPDATE_INTERVAL / 2,
    },
  );

  return {
    health: data,
    isLoading: (!data && isValidating) || isLoading,
    error: error ?? null,
  };
};
