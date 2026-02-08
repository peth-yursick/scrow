import { Button } from '@chakra-ui/react';
import { BASE_URL } from '@scrow/constants';
import { InvoiceDetails } from '@scrow/types';
import { chainLabelFromId, getChainName } from '@scrow/utils';
import { RWebShare } from 'react-web-share';

import { ShareIcon } from '../icons';

export function ShareButton({ invoice }: { invoice: Partial<InvoiceDetails> }) {
  const { chainId, id: invoiceId, metadata } = invoice;
  const { title } = metadata || {};

  const chainLabel = invoice.chainId
    ? chainLabelFromId(invoice.chainId)
    : 'unknown';

  const url = `${BASE_URL}/invoice/${chainLabel}/${invoiceId}`;

  const text = `sCrow for ${title} on ${getChainName(chainId)}`;

  return (
    <RWebShare
      data={{
        text,
        title,
        url,
      }}
    >
      <Button
        variant="ghost"
        bg="none"
        colorScheme="blue"
        h="auto"
        w="auto"
        minW="2"
        p={1}
      >
        <ShareIcon boxSize={5} />
      </Button>
    </RWebShare>
  );
}
