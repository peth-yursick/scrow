import { InvoiceDetails, UseToastReturn } from '@scrow/types';

import { useTransaction } from './useTransaction';

export const useVerify = ({
  address,
  chainId,
  toast,
  onTxSuccess,
}: {
  address: `0x${string}` | undefined;
  chainId: number;
  toast: UseToastReturn;
  onTxSuccess?: () => void;
}) => {
  // Create a minimal invoice-like object for useTransaction
  const invoiceLike = { address } as Partial<InvoiceDetails>;

  return useTransaction({
    invoice: invoiceLike,
    functionName: 'verify',
    args: undefined,
    chainId,
    toastPrefix: 'useVerify',
    onTxSuccess,
    toast,
  });
};
