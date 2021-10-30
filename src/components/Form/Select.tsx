import {
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  options?: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  options,
  isReadOnly,
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
      <ChakraSelect
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
        _focus={
          isReadOnly
            ? { bg: "gray.800" }
            : { bg: "gray.900", borderColor: "blue.500" }
        }
        size="lg"
        {...selectProps}
      >
        <option value="" key="first">
          {" "}
          Selecione uma opção{" "}
        </option>
        {options?.map((option) => (
          <option
            style={{
              backgroundColor: "var(--chakra-colors-gray-900)",
              color: "var(--chakra-colors-gray-50)",
            }}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </ChakraSelect>
    </FormControl>
  );
};
