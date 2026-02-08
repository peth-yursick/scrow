import { useToast } from '@scrow/ui';
import { useCallback } from 'react';

interface NotificationInvoiceData {
  title: string;
  chainId: number;
  invoiceId: string;
  clientAddress?: string;
  providerAddress?: string;
  amount?: string;
}

interface NotificationOptions {
  arbitratorFid: number;
  arbitratorUsername: string;
  type: 'selected' | 'dispute';
  invoiceData: NotificationInvoiceData;
}

/**
 * Hook to send notifications to Farcaster arbitrators
 *
 * This hook provides a function to notify arbitrators when:
 * - They are selected as an arbitrator for an invoice
 * - A dispute is raised and needs their attention
 *
 * The notification is sent via the sCrow notification API which creates
 * a Farcaster frame that can be cast to the arbitrator.
 */
export function useArbitratorNotification() {
  const toast = useToast();

  const notifyArbitrator = useCallback(
    async ({
      arbitratorFid,
      arbitratorUsername,
      type,
      invoiceData,
    }: NotificationOptions): Promise<boolean> => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/notify-arbitrator`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            arbitratorFid,
            arbitratorUsername,
            type,
            invoiceData,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to send notification:', error);
          // Don't throw error, just log it - notification failure shouldn't break the flow
          return false;
        }

        const data = await response.json();

        if (data.success) {
          console.log('Notification sent successfully:', {
            arbitrator: arbitratorUsername,
            type,
            invoiceId: invoiceData.invoiceId,
            notificationUrl: data.data.notificationUrl,
          });

          // Show a toast to confirm notification was sent
          toast.success(
            type === 'selected'
              ? `Arbitrator @${arbitratorUsername} has been notified`
              : `Arbitrator @${arbitratorUsername} has been notified of the dispute`
          );

          return true;
        }

        return false;
      } catch (error) {
        console.error('Error sending notification:', error);
        // Don't show error toast to user - notification failure is non-critical
        return false;
      }
    },
    [toast]
  );

  return { notifyArbitrator };
}
