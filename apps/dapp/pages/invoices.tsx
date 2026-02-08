import { InvoiceDashboardTable } from '@scrow/ui';

// Disable static generation as this page uses components that require WagmiProvider
export const getServerSideProps = () => ({
  props: {},
});

function Invoices() {
  return <InvoiceDashboardTable />;
}

export default Invoices;
