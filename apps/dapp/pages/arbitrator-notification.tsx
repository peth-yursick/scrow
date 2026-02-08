import { Box, Button, Container, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

// Disable static generation as this page uses components that require WagmiProvider
export const getServerSideProps = () => ({
  props: {},
});

export default function ArbitratorNotificationPage() {
  const router = useRouter();
  const {
    fid,
    username,
    type,
    chainId,
    invoiceId,
  } = router.query as {
    fid?: string;
    username?: string;
    type?: string;
    chainId?: string;
    invoiceId?: string;
  };

  if (!type || !username) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={4} textAlign="center">
          <Heading color="text">Invalid Notification</Heading>
          <Text color="textMuted">
            This notification link is invalid or has expired.
          </Text>
        </VStack>
      </Container>
    );
  }

  const isSelectionNotification = type === 'selected';
  const invoiceUrl = chainId && invoiceId ? `/invoice/${chainId}/${invoiceId}` : '/';
  const disputeUrl = chainId && invoiceId ? `/invoice/${chainId}/${invoiceId}/locked` : '/';

  return (
    <Box
      minH="100vh"
      bg="background"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="container.md" centerContent>
        <Stack
          spacing={6}
          p={8}
          bg="card"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="border"
          textAlign="center"
        >
          {/* Icon or illustration */}
          <Box
            w="80px"
            h="80px"
            bg="primary"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
          >
            <Text fontSize="4xl">⚖️</Text>
          </Box>

          <VStack spacing={4}>
            <Heading as="h1" size="xl" color="text">
              {isSelectionNotification
                ? 'You have been selected as an arbitrator!'
                : 'A dispute requires your attention'}
            </Heading>

            <Text fontSize="lg" color="textMuted" lineHeight="tall">
              {isSelectionNotification
                ? `You have been chosen to serve as the arbitrator for a sCrow invoice. Please review the details and confirm your availability.`
                : `A dispute has been raised on a sCrow invoice where you are the arbitrator. Please review the case and provide your decision.`}
            </Text>

            {/* Action buttons */}
            <Stack spacing={3} direction="row" justify="center" mt={4}>
              <Button
                as="a"
                href={isSelectionNotification ? invoiceUrl : disputeUrl}
                size="lg"
                bg="primary"
                color="white"
                _hover={{ bg: 'primaryHover' }}
                minWidth="200px"
              >
                {isSelectionNotification ? 'View Invoice' : 'Review Dispute'}
              </Button>
            </Stack>

            {/* Additional info */}
            <Box
              p={4}
              bg="muted"
              borderRadius="md"
              textAlign="left"
              width="100%"
            >
              <Text fontSize="sm" color="textSecondary">
                <strong>Notification type:</strong>{' '}
                {isSelectionNotification ? 'Arbitrator Selection' : 'Dispute Raised'}
              </Text>
              {username && (
                <Text fontSize="sm" color="textSecondary" mt={2}>
                  <strong>Username:</strong> @{username}
                </Text>
              )}
              {invoiceId && (
                <Text fontSize="sm" color="textSecondary" mt={2}>
                  <strong>Invoice ID:</strong> {invoiceId}
                </Text>
              )}
            </Box>

            {/* Footer note */}
            <Text fontSize="xs" color="textMuted" mt={4}>
              This is an automated notification from sCrow. If you believe this
              was sent in error, please contact support.
            </Text>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
}
