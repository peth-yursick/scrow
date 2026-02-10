/* eslint-disable react/jsx-props-no-spreading */
import 'focus-visible/dist/focus-visible';
import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider, ColorModeScript, CSSReset } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AccountAvatar, ErrorBoundary, globalStyles, theme } from '@scrow/ui';
import { wagmiConfig } from '@scrow/utils';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { hashFn } from '@wagmi/core/query';
import { AppProps } from 'next/app';
import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';

import { ClientOnlyLayout } from '../components/ClientOnlyLayout';
import { FrameProvider } from '../contexts/FrameContext';
import { OverlayContextProvider } from '../contexts/OverlayContext';

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

  // For error pages, render directly. For normal pages, wrap with ClientOnlyLayout
  const content = isErrorPage ? (
    <Component {...pageProps} />
  ) : (
    <ClientOnlyLayout>
      <Component {...pageProps} />
    </ClientOnlyLayout>
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider avatar={AccountAvatar}>
            <ChakraProvider theme={theme}>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <CSSReset />
              <Global styles={globalStyles} />
              <ErrorBoundary>
                <FrameProvider>
                  <OverlayContextProvider>{content}</OverlayContextProvider>
                </FrameProvider>
              </ErrorBoundary>
            </ChakraProvider>
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
