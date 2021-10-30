import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  isReadOnly,
  ...inputProps
}) => {
  return (
    <FormControl>
      {label && (
        <FormLabel
          fontSize={isReadOnly ? 18 : 16}
          fontWeight={isReadOnly ? "bold" : undefined}
          htmlFor={name}
        >
          {label}
        </FormLabel>
      )}
      <ChakraInput
        id={name}
        name={name}
        isReadOnly={isReadOnly}
        focusBorderColor={isReadOnly ? "gray.900" : "blue.500"}
        bg={isReadOnly ? "gray.800" : "gray.900"}
        borderBottom={
          isReadOnly
            ? "1px solid var(--chakra-colors-whiteAlpha-100)"
            : undefined
        }
        borderRadius={isReadOnly ? 0 : undefined}
        variant="filled"
        _hover={{ bg: isReadOnly ? "gray.800" : "gray.900" }}
        _focus={isReadOnly ? { bg: "gray.800" } : undefined}
        size="lg"
        {...inputProps}
      />
    </FormControl>
  );
};
