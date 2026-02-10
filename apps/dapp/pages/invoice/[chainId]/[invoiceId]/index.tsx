import { Flex, Spinner } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import _ from 'lodash';
import { Hex } from 'viem';
import { isAddress } from 'viem';
import { parseChainId } from '@scrow/utils';

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

  return { props: {} };
}

// Dynamically import the content component with SSR disabled
const ViewInvoiceContent = dynamic(() => import('../../../../components/client-pages/ViewInvoiceContent'), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" h="100vh" w="100%" bg="background" color="text">
      <Spinner size="xl" />
    </Flex>
  ),
});

export default function ViewInvoice() {
  return <ViewInvoiceContent />;
}
