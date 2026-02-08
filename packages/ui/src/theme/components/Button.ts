import { StyleFunctionProps } from '@chakra-ui/react';

export const Button = {
  baseStyle: {
    fontWeight: 'normal',
  },
  defaultProps: {
    variant: 'solid',
  },
  variants: {
    solid: (props: StyleFunctionProps) => ({
      _hover: { backgroundColor: 'primaryHover' },
      _active: { backgroundColor: 'primaryHover' },
      color: 'white',
      backgroundColor: 'primary',
      fontFamily: 'mono',
      fontWeight: props.fontWeight || 'normal',
    }),
    outline: {
      color: 'primary',
      borderColor: 'primary',
      borderWidth: 2,
      backgroundColor: 'transparent',
      _hover: { backgroundColor: 'rgba(138, 99, 210, 0.1)' },
      _active: { backgroundColor: 'rgba(138, 99, 210, 0.1)' },
    },
    ghost: {
      bg: 'transparent',
      color: 'text',
      _hover: {
        bg: 'muted',
      },
    },
    max: {
      color: 'primary',
      borderColor: 'primary',
      borderWidth: 1,
      backgroundColor: 'card',
      width: '300px',
      minH: '200px',
      paddingY: 6,
      _hover: { backgroundColor: 'cardHover', color: 'primaryLight' },
      _active: { backgroundColor: 'cardHover', color: 'primaryLight' },
    },
  },
};
