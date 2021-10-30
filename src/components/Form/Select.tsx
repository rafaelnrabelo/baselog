import {
  Select as SelectInput,
  SelectProps as ChakraSelectProps,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  isReadOnly,
  children,
  ...selectProps
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
      <SelectInput
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
        {...selectProps}
      >
        {children}
      </SelectInput>
    </FormControl>
  );
};
