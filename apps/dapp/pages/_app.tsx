/* eslint-disable react/jsx-props-no-spreading */
import 'focus-visible/dist/focus-visible';
import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider, ColorModeScript, CSSReset } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hashFn } from '@wagmi/core/query';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';

import { AccountAvatar, ErrorBoundary, globalStyles, theme } from '@/lib/ui';
import { wagmiConfig } from '@/lib/utils';

import { FrameProvider } from '../contexts/FrameContext';
import { OverlayContextProvider } from '../contexts/OverlayContext';

// Dynamically import Layout (uses wagmi hooks) with SSR disabled
const Layout = dynamic(
  () => import('@/lib/ui').then(mod => ({ default: mod.Layout })),
  { ssr: false },
);

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryKeyHashFn: hashFn,
            staleTime: 300000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );

  // Detect error pages by checking for statusCode in pageProps or skipLayout property on component
  const isErrorPage =
    'statusCode' in pageProps || (Component as any).skipLayout === true;

  const content = isErrorPage ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider avatar={AccountAvatar}>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <CSSReset />
            <Global styles={globalStyles} />
            <ErrorBoundary>
              <FrameProvider>
                <OverlayContextProvider>{content}</OverlayContextProvider>
              </FrameProvider>
            </ErrorBoundary>
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
