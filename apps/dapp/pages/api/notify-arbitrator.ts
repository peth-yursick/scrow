import type { NextApiRequest, NextApiResponse } from 'next';
import { withCors } from '../../utils/cors';

interface FarcasterNotificationRequest {
  arbitratorFid: number;
  arbitratorUsername: string;
  type: 'selected' | 'dispute';
  invoiceData?: {
    title: string;
    chainId: number;
    invoiceId: string;
    clientAddress?: string;
    providerAddress?: string;
    amount?: string;
  };
}

/**
 * API endpoint to send notifications to Farcaster arbitrators
 *
 * This endpoint creates a frame that can be cast to notify arbitrators:
 * - When they are selected as an arbitrator for an invoice
 * - When a dispute is raised and needs their attention
 *
 * Note: In production, you would integrate with a Farcaster notification service
 * like Warpcast Cast API or Neynar API to actually deliver the notification.
 *
 * For now, this endpoint returns the frame data that can be used to notify the user.
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { arbitratorFid, arbitratorUsername, type, invoiceData } =
      req.body as FarcasterNotificationRequest;

    if (!arbitratorFid || !arbitratorUsername) {
      return res.status(400).json({ error: 'Missing arbitrator information' });
    }

    if (!type || !['selected', 'dispute'].includes(type)) {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    // Construct the notification frame
    const frame = {
      version: '1',
      name: 'sCrow Arbitrator Notification',
      description: getNotificationMessage(type, invoiceData),
      imageUrl: getNotificationImageUrl(type),
      buttonUrl: getNotificationButtonUrl(type, invoiceData),
      buttonText: getNotificationButtonText(type),
    };

    // TODO: Integrate with actual Farcaster notification delivery service
    // Options:
    // 1. Neynar API (https://docs.neynar.com/) - Send direct casts/notifications
    // 2. Warpcast Cast API - Create casts that tag the user
    // 3. Airstack - Send notifications via their API
    // 4. Custom frame that users open to see their pending arbitrations

    // For now, we'll return success with the frame data
    // In production, you would call the Farcaster API here

    res.status(200).json({
      success: true,
      message: 'Notification frame created',
      data: {
        arbitratorFid,
        arbitratorUsername,
        type,
        frame,
        // Return the URL that can be used to notify the arbitrator
        notificationUrl: getNotificationUrl(arbitratorFid, arbitratorUsername, type, invoiceData),
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
}

function getNotificationMessage(
  type: 'selected' | 'dispute',
  invoiceData?: FarcasterNotificationRequest['invoiceData'],
): string {
  if (type === 'selected') {
    return `You have been selected as an arbitrator for the invoice: ${invoiceData?.title || 'Untitled'}`;
  }
  return `A dispute has been raised on invoice: ${invoiceData?.title || 'Untitled'}. Your arbitration is needed.`;
}

function getNotificationImageUrl(type: 'selected' | 'dispute'): string {
  // TODO: Create actual notification images
  // For now, return a placeholder or the sCrow banner
  return type === 'selected'
    ? 'https://scrow.xyz/images/arbitrator-selected.png'
    : 'https://scrow.xyz/images/dispute-raised.png';
}

function getNotificationButtonUrl(type: 'selected' | 'dispute', invoiceData?: any): string {
  if (type === 'selected' && invoiceData) {
    return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invoice/${invoiceData.chainId}/${invoiceData.invoiceId}`;
  }
  if (type === 'dispute' && invoiceData) {
    return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invoice/${invoiceData.chainId}/${invoiceData.invoiceId}/locked`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

function getNotificationButtonText(type: 'selected' | 'dispute'): string {
  return type === 'selected' ? 'View Invoice' : 'Review Dispute';
}

function getNotificationUrl(
  fid: number,
  username: string,
  type: 'selected' | 'dispute',
  invoiceData?: any,
): string {
  // Return a URL that can be used to open a frame or cast
  // This could be a deep link to the sCrow app with the arbitration context
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const params = new URLSearchParams({
    fid: fid.toString(),
    username,
    type,
    ...(invoiceData?.chainId && { chainId: invoiceData.chainId.toString() }),
    ...(invoiceData?.invoiceId && { invoiceId: invoiceData.invoiceId }),
  });

  return `${baseUrl}/arbitrator-notification?${params.toString()}`;
}

export default withCors()(handler);
