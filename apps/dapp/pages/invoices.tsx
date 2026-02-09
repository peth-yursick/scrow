import { Flex, Spinner } from '@chakra-ui/react';
import { InvoiceDashboardTable } from '@scrow/ui';
import { useEffect, useState } from 'react';

// Disable static generation as this page uses wagmi hooks
export const getServerSideProps = () => ({
  props: {},
});

export default function Invoices() {
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
    );
  }

  return <InvoiceDashboardTable />;
}
