import { Box, HStack, VStack } from "@chakra-ui/react";

import PaginationItem from "./PaginationItem";

const Pagination: React.FC = () => {
  return (
    <VStack mt="8" justify="center" align="center">
      <Box>
        <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
      </Box>
      <HStack spacing="2" mt="2">
        <PaginationItem isCurrent number={1} />
        <PaginationItem number={2} />
        <PaginationItem number={3} />
        <PaginationItem number={4} />
      </HStack>
    </VStack>
  );
};

export default Pagination;
