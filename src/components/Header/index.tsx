import { Flex, IconButton, Icon, useBreakpointValue } from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";

import Logo from "./Logo";
import { useSideBarDrawer } from "../../contexts/SidebarDrawerContext";

const Header: React.FC = () => {
  const { onOpen } = useSideBarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex
      as="header"
      w="100%"
      maxW={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          aria-label="Open navigation"
          mr="2"
        />
      )}

      <Logo />
    </Flex>
  );
};

export default Header;
