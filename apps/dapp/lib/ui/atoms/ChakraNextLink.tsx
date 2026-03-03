import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export function ChakraNextLink({
  href = '',
  ...props
}: Omit<ChakraLinkProps, 'href'> & { href?: string | undefined }) {
  return <ChakraLink as={NextLink} href={href} {...props} />;
}
