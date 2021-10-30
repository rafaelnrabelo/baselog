import { Box, VStack, Text } from "@chakra-ui/react";

interface NavSectionProps {
  title: string;
}

export const NavSection: React.FC<NavSectionProps> = ({ title, children }) => {
  return (
    <Box>
      <Text fontWeight="bold" color="gray.400" fontSize="small">
        {title}
      </Text>
      <VStack spacing="4" mt="8" align="stretch">
        {children}
      </VStack>
    </Box>
  );
};
