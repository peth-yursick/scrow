import { InvoiceDetails, UseToastReturn } from '@scrow/types';
import _ from 'lodash';

import { useTransaction } from './useTransaction';

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
}) => {
  const specifiedMilestone = _.isNumber(milestone);

  return useTransaction({
    invoice,
    functionName: 'release',
    args: specifiedMilestone ? [BigInt(milestone)] : undefined,
    toastPrefix: 'useRelease',
    onTxSuccess,
    toast,
  });
};
