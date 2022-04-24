import { ComponentWithAs, Text, TextProps } from "@chakra-ui/react";

export const Logo: React.FC<TextProps> = (props) => {
  return (
    <Text
      fontSize={["2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      w="64"
      {...props}
    >
      baselog
      <Text color="blue.500" ml="1" as="span">
        .
      </Text>
    </Text>
  );
};
