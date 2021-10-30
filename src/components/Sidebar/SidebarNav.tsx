import { Stack } from "@chakra-ui/react";
import {
  RiContactsLine,
  RiDashboardLine,
  RiExchangeBoxLine,
  RiArchiveLine,
} from "react-icons/ri";

import NavLink from "./NavLink";
import NavSection from "./NavSection";

const SidebarNav: React.FC = () => {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink
          icon={RiDashboardLine}
          label="Dashboard"
          href="/"
          shouldMatchExactHref
        />
      </NavSection>
      <NavSection title="GERENCIAMENTO">
        <NavLink icon={RiArchiveLine} label="Produtos" href="/products" />
        <NavLink icon={RiExchangeBoxLine} label="Vendas" href="/sales" />
      </NavSection>
      <NavSection title="PESSOAS">
        <NavLink icon={RiContactsLine} label="Clientes" href="/clients" />
      </NavSection>
    </Stack>
  );
};

export default SidebarNav;
