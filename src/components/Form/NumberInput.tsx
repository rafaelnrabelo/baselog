import {
  NumberInput as ChakraNumberInput,
  NumberInputProps as ChakraNumberInputProps,
  NumberInputField,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

interface InputProps extends ChakraNumberInputProps {
  name: string;
  label?: string;
}

export const NumberInput: React.FC<InputProps> = ({
  name,
  label,
  ...inputProps
}) => {
  return (
    <FormControl>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraNumberInput
        id={name}
        name={name}
        focusBorderColor="blue.500"
        bg="gray.900"
        variant="filled"
        _hover={{ bg: "gray.900" }}
        size="lg"
        {...inputProps}
      >
        <NumberInputField
          focusBorderColor="blue.500"
          bg="gray.900"
          variant="filled"
          _hover={{ bg: "gray.900" }}
        />
      </ChakraNumberInput>
    </FormControl>
  );
};
