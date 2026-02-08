export const Textarea = {
  baseStyle: {},
  defaultProps: {
    variant: 'filled',
  },
  variants: {
    filled: {
      bg: 'card',
      color: 'text',
      border: '1px solid',
      borderColor: 'border',
      _hover: { borderColor: 'borderGrey' },
      _focus: { borderColor: 'primary', boxShadow: '0 0 0 1px primary' },
      _invalid: { border: '1px solid', borderColor: 'red' },
      _placeholder: { color: 'textMuted' },
    },
  },
};
