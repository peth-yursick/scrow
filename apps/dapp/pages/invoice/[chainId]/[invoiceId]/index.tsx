import { Button, Flex, Spinner, Stack } from '@chakra-ui/react';
import { INVOICE_TYPES } from '@scrow/constants';
import {
  InstantButtonManager,
  InstantPaymentDetails,
  InvoiceButtonManager,
  InvoicePaymentDetails,
} from '@scrow/forms';
import { useInvoiceDetails } from '@scrow/hooks';
import {
  Container,
  InvoiceMetaDetails,
  InvoiceNotFound,
  Loader,
} from '@scrow/ui';
import { getChainName, parseChainId } from '@scrow/utils';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Hex, isAddress } from 'viem';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { useOverlay } from '../../../../contexts/OverlayContext';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { invoiceId: invId, chainId: urlChainId } = context.params as {
    invoiceId: string;
    chainId: string;
  };

  const invoiceId = _.toLower(String(invId)) as Hex;
  const chainId = parseChainId(urlChainId);

  if (!chainId) {
    return { notFound: true };
  }

  let dehydratedState = null;
  try {
    const { prefetchInvoiceDetails } = await import('@scrow/hooks/src/prefetchInvoiceDetails');
    dehydratedState = await prefetchInvoiceDetails(invoiceId, chainId);
  } catch (error) {
    console.error('Server-side prefetch failed:', error);
  }

  return { props: { dehydratedState } };
}

function ViewInvoiceContent() {
  const router = useRouter();
  const { invoiceId: invId, chainId: urlChainId } = router.query;
  const invoiceId = _.toLower(String(invId)) as Hex;
  const invoiceChainId = parseChainId(urlChainId);
  const { invoiceDetails, isLoading } = useInvoiceDetails({
    chainId: invoiceChainId,
    address: invoiceId,
  });
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const overlay = useOverlay();

  if (!isAddress(invoiceId) || (!invoiceDetails === null && !isLoading)) {
    return <InvoiceNotFound />;
  }

  if (!invoiceDetails || isLoading) {
    return (
      <Container overlay gap={10}>
        <Loader size="80" />
        If the invoice does not load,
        <br />
        please refresh the browser.
      </Container>
    );
  }

  const invoiceType = _.get(invoiceDetails, 'invoiceType', INVOICE_TYPES.Escrow);
  const isInvalidChainId = !!address && !!invoiceChainId && chainId !== invoiceChainId;

  return (
    <Container overlay>
      <Stack spacing="2rem" justify="center" align="center" direction={{ base: 'column', lg: 'row' }} w="100%" px="1rem" py="8rem">
        <InvoiceMetaDetails invoice={invoiceDetails} />
        <Stack maxW="60rem" w="100%" spacing={4}>
          {invoiceType === INVOICE_TYPES.Instant ? (
            <>
              <InstantPaymentDetails invoice={invoiceDetails} />
              <InstantButtonManager invoice={invoiceDetails} {...overlay} />
            </>
          ) : (
            <>
              <InvoicePaymentDetails invoice={invoiceDetails} {...overlay} />
              <InvoiceButtonManager invoice={invoiceDetails} {...overlay} />
            </>
          )}
          {isInvalidChainId && (
            <Button bg="orange.600" _hover={{ bg: 'orange.700' }} onClick={() => switchChain?.({ chainId: invoiceChainId })} gap={2} w="100%">
              Click here to switch network to {getChainName(invoiceChainId)}
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default function ViewInvoice() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Small delay to ensure WagmiProvider is fully hydrated after navigation
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <Flex justify="center" align="center" h="100vh" w="100%" bg="background" color="text">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return <ViewInvoiceContent />;
}
