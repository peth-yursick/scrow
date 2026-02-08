import {
  SMART_INVOICE_UPDATABLE_ABI,
  TOASTS,
} from '@scrow/constants';
import { waitForSubgraphSync } from '@scrow/graphql';
import { InvoiceDetails, UseToastReturn } from '@scrow/types';
import { errorToastHandler } from '@scrow/utils';
import { useCallback, useState } from 'react';
import { Hex } from 'viem';
import {
  useChainId,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';

import { SimulateContractErrorType, WriteContractErrorType } from './types';

export type TransactionConfig<TArgs extends any[] = []> = {
  invoice: Partial<InvoiceDetails>;
  functionName: string;
  args?: TArgs | undefined;
  enabled?: boolean;
  chainId?: number;
  toastPrefix: keyof typeof TOASTS;
  onTxSuccess?: () => void;
  toast: UseToastReturn;
  waitForIndex?: boolean;
};

export const useTransaction = <TArgs extends any[] = []>({
  invoice,
  functionName,
  args,
  enabled = true,
  chainId: overrideChainId,
  toastPrefix,
  onTxSuccess,
  toast,
  waitForIndex = true,
}: TransactionConfig<TArgs>): {
  writeAsync: () => Promise<Hex | undefined>;
  isLoading: boolean;
  prepareError: SimulateContractErrorType | null;
  writeError: WriteContractErrorType | null;
} => {
  const currentChainId = useChainId();
  const chainId = overrideChainId ?? currentChainId;
  const publicClient = usePublicClient();

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    chainId,
    address: invoice?.address as Hex,
    abi: SMART_INVOICE_UPDATABLE_ABI,
    functionName,
    args,
    query: {
      enabled: enabled && !!invoice?.address,
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
        toast.loading(TOASTS[toastPrefix].waitingForTx);
        const receipt = await publicClient?.waitForTransactionReceipt({ hash });

        if (waitForIndex) {
          toast.loading(TOASTS[toastPrefix].waitingForIndex);
          if (receipt && publicClient) {
            await waitForSubgraphSync(publicClient.chain.id, receipt.blockNumber);
          }
        }

        setWaitingForTx(false);
        onTxSuccess?.();
      },
      onError: (error: Error) => errorToastHandler(toastPrefix, error, toast),
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      errorToastHandler(toastPrefix, error as Error, toast);
      return undefined;
    }
  }, [writeContractAsync, data, toastPrefix, toast]);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading || waitingForTx,
    prepareError,
    writeError,
  };
};
