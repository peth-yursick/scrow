import {
  SMART_INVOICE_UPDATABLE_ABI,
  TOASTS,
} from '@scrow/constants';
import { waitForSubgraphSync } from '@scrow/graphql';
import { InvoiceDetails, UseToastReturn } from '@scrow/types';
import { errorToastHandler } from '@scrow/utils';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { Hex } from 'viem';
import {
  useChainId,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';

import { SimulateContractErrorType, WriteContractErrorType } from './types';

export const useRelease = ({
  invoice,
  milestone,
  onTxSuccess,
  toast,
}: {
  invoice: Partial<InvoiceDetails>;
  milestone?: number;
  onTxSuccess: () => void;
  toast: UseToastReturn;
}): {
  writeAsync: () => Promise<Hex | undefined>;
  isLoading: boolean;
  prepareError: SimulateContractErrorType | null;
  writeError: WriteContractErrorType | null;
} => {
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const specifiedMilestone = _.isNumber(milestone);

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    chainId,
    address: invoice?.address as Hex,
    abi: SMART_INVOICE_UPDATABLE_ABI,
    functionName: 'release',
    args: specifiedMilestone ? [BigInt(milestone)] : undefined,
    query: {
      enabled: !!invoice?.address,
    },
  });

  const [waitingForTx, setWaitingForTx] = useState(false);

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async hash => {
        setWaitingForTx(true);
        toast.loading(TOASTS.useRelease.waitingForTx);
        const receipt = await publicClient?.waitForTransactionReceipt({ hash });

        toast.loading(TOASTS.useRelease.waitingForIndex);
        if (receipt && publicClient) {
          await waitForSubgraphSync(publicClient.chain.id, receipt.blockNumber);
        }
        setWaitingForTx(false);
        onTxSuccess?.();
      },
      onError: (error: Error) => errorToastHandler('useRelease', error, toast),
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      errorToastHandler('useRelease', error as Error, toast);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading || waitingForTx,
    prepareError,
    writeError,
  };
};
