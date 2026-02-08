export const Input = {
  baseStyle: {},
  defaultProps: {
    variant: 'outline',
  },
  variants: {
    outline: {
      field: {
        bg: 'card',
        color: 'text',
        border: '1px solid',
        borderColor: 'border',
        _hover: { borderColor: 'borderGrey' },
        _focus: { borderColor: 'primary', boxShadow: '0 0 0 1px primary' },
        _invalid: { borderWidth: '2px', borderColor: 'red.500' },
        _placeholder: { color: 'textMuted' },
      },
    },
  },
};
