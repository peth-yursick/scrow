import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { FiExternalLink, FiSearch, FiUser } from 'react-icons/fi';
import _ from 'lodash';
import { useState } from 'react';
import { Controller, RegisterOptions, UseFormReturn } from 'react-hook-form';

import { InfoOutlineIcon } from '../icons';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  address?: string;
}

interface FarcasterUserInputProps {
  name: string;
  label?: string;
  tooltip?: string;
  helperText?: string;
  localForm: UseFormReturn<any>;
  registerOptions?: RegisterOptions;
  placeholder?: string;
  spacing?: number | string;
  farcasterFidFieldName?: string;
  farcasterUsernameFieldName?: string;
}

export function FarcasterUserInput({
  name,
  label,
  tooltip,
  helperText,
  localForm,
  registerOptions,
  placeholder = 'Search by username or fid...',
  spacing,
  farcasterFidFieldName,
  farcasterUsernameFieldName,
}: FarcasterUserInputProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = localForm;

  const error = errors[name] && errors[name]?.message;
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FarcasterUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FarcasterUser | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const searchFarcasterUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using Searchcaster API
      const response = await fetch(
        `https://searchcaster.xyz/api/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data && data.results) {
        const users: FarcasterUser[] = data.results
          .filter((result: any) => result.type === 'user')
          .map((result: any) => ({
            fid: result.body.fid,
            username: result.body.username,
            displayName: result.body.displayName || result.body.username,
            pfpUrl: result.body.pfpUrl?.url || '',
          }));
        setSuggestions(users);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching Farcaster users:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = _.debounce(searchFarcasterUsers, 300);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedUser(null);
    debouncedSearch(value);
    if (value.length >= 2) {
      onOpen();
    } else {
      onClose();
    }
  };

  const handleSelectUser = (user: FarcasterUser, onChange: (value: string) => void) => {
    setSelectedUser(user);
    setSearchQuery(`@${user.username}`);
    onChange(user.address || user.fid.toString());

    // Store Farcaster user data for notifications
    if (farcasterFidFieldName) {
      setValue(farcasterFidFieldName, user.fid);
    }
    if (farcasterUsernameFieldName) {
      setValue(farcasterUsernameFieldName, user.username);
    }

    onClose();
  };

  const handleClearSelection = (onChange: (value: string) => void) => {
    setSelectedUser(null);
    setSearchQuery('');
    onChange('');

    // Clear Farcaster user data
    if (farcasterFidFieldName) {
      setValue(farcasterFidFieldName, undefined);
    }
    if (farcasterUsernameFieldName) {
      setValue(farcasterUsernameFieldName, undefined);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={registerOptions}
      render={({ field: { onChange, value, ref } }) => (
        <FormControl isInvalid={!!error} mt={spacing}>
          <Stack spacing={2}>
            {label && (
              <HStack align="center">
                <FormLabel m={0}>{label}</FormLabel>
                {tooltip && (
                  <Tooltip
                    label={tooltip}
                    placement="right"
                    hasArrow
                    shouldWrapChildren
                  >
                    <Icon
                      as={InfoOutlineIcon}
                      boxSize={3}
                      color="primary"
                      bg="card"
                      borderRadius="full"
                    />
                  </Tooltip>
                )}
              </HStack>
            )}

            <Popover
              isOpen={isOpen && suggestions.length > 0}
              onClose={onClose}
              placement="bottom-start"
              closeOnBlur
            >
              <PopoverTrigger>
                <Box>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiSearch color="gray" />
                    </InputLeftElement>
                    <Input
                      ref={ref}
                      value={searchQuery}
                      onChange={e => handleInputChange(e.target.value)}
                      onFocus={e => {
                        if (e.target.value.length >= 2) {
                          onOpen();
                        }
                      }}
                      placeholder={placeholder}
                      bg="card"
                      color="text"
                      _focus={{ borderColor: 'primary' }}
                    />
                  </InputGroup>
                  {selectedUser && (
                    <HStack mt={2} spacing={3} bg="muted" p={2} borderRadius="md">
                      <Image
                        src={selectedUser.pfpUrl}
                        alt={selectedUser.username}
                        boxSize="30px"
                        borderRadius="full"
                        fallbackSrc="https://via.placeholder.com/30"
                      />
                      <Box flex={1}>
                        <Text fontSize="sm" fontWeight="bold" color="text">
                          {selectedUser.displayName}
                        </Text>
                        <Text fontSize="xs" color="textMuted">
                          @{selectedUser.username}
                        </Text>
                      </Box>
                      <ChakraLink
                        as="button"
                        fontSize="xs"
                        color="primary"
                        onClick={() => handleClearSelection(onChange)}
                      >
                        Clear
                      </ChakraLink>
                    </HStack>
                  )}
                </Box>
              </PopoverTrigger>
              <Portal>
                <PopoverContent
                  bg="card"
                  borderColor="border"
                  width="100%"
                  maxW="400px"
                  zIndex={10}
                >
                  <PopoverArrow bg="card" />
                  <PopoverBody p={0}>
                    <List maxHeight="300px" overflowY="auto">
                      {isLoading ? (
                        <ListItem p={3}>
                          <Text color="textMuted" fontSize="sm">
                            Searching...
                          </Text>
                        </ListItem>
                      ) : suggestions.length > 0 ? (
                        suggestions.map(user => (
                          <ListItem
                            key={user.fid}
                            p={3}
                            _hover={{ bg: 'muted' }}
                            cursor="pointer"
                            onClick={() => handleSelectUser(user, onChange)}
                            borderBottom="1px solid"
                            borderColor="border"
                          >
                            <HStack spacing={3}>
                              <Image
                                src={user.pfpUrl}
                                alt={user.username}
                                boxSize="30px"
                                borderRadius="full"
                                fallbackSrc="https://via.placeholder.com/30"
                              />
                              <Box flex={1}>
                                <Text
                                  fontSize="sm"
                                  fontWeight="bold"
                                  color="text"
                                >
                                  {user.displayName}
                                </Text>
                                <Text fontSize="xs" color="textMuted">
                                  @{user.username}
                                </Text>
                              </Box>
                              <ListIcon
                                as={FiUser}
                                color="primary"
                                boxSize={4}
                              />
                            </HStack>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem p={3}>
                          <Text color="textMuted" fontSize="sm">
                            No users found
                          </Text>
                        </ListItem>
                      )}
                    </List>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>

            {selectedUser && (
              <ChakraLink
                href={`https://warpcast.com/${selectedUser.username}`}
                isExternal
                fontSize="xs"
                color="primary"
                display="inline-flex"
                alignItems="center"
                gap={1}
              >
                View profile <FiExternalLink size={12} />
              </ChakraLink>
            )}

            {helperText && <FormHelperText>{helperText}</FormHelperText>}
            {typeof error === 'string' && (
              <FormErrorMessage>{error}</FormErrorMessage>
            )}
          </Stack>
        </FormControl>
      )}
    />
  );
}
