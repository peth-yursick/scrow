import { Flex, Spinner } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

// Disable static generation as this page uses wagmi hooks
export const getServerSideProps = () => ({
  props: {},
});

// Dynamically import the table component with SSR disabled
const InvoiceDashboardTable = dynamic(() => import('./InvoicesContent'), {
  ssr: false,
  loading: () => (
    <Flex
      justify="center"
      align="center"
      h="100vh"
      w="100%"
      bg="background"
      color="text"
    >
      <Spinner size="xl" />
    </Flex>
  ),
});

export default function Invoices() {
  return <InvoiceDashboardTable />;
}
