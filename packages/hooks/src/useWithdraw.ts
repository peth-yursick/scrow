import { InvoiceDetails, UseToastReturn } from '@scrow/types';

import { useTransaction } from './useTransaction';

export const useWithdraw = ({
  invoice,
  onTxSuccess,
  toast,
}: {
  invoice: Partial<InvoiceDetails>;
  onTxSuccess: () => void;
  toast: UseToastReturn;
}) => {
  return useTransaction({
    invoice,
    functionName: 'withdraw',
    args: undefined,
    toastPrefix: 'useWithdraw',
    onTxSuccess,
    toast,
  });
};
