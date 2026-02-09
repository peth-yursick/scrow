import { Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

// Disable static generation as this page uses wagmi hooks
export const getServerSideProps = () => ({
  props: {},
});

// Dynamically import the content component with SSR disabled
const CreateInvoiceContent = dynamic(() => import('../../components/client-pages/CreateInvoiceContent'), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" h="100vh" w="100%" bg="background" color="text">
      <Spinner size="xl" />
    </Flex>
  ),
});

export default function CreateInvoiceEscrow() {
  return (
    <>
      <CreateInvoiceContent />
    </>
  );
}
