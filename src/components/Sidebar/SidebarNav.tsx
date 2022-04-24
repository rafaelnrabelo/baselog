import { Stack } from "@chakra-ui/react";
import {
  RiContactsLine,
  RiShoppingCartLine,
  RiArchiveLine,
} from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";

import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export const SidebarNav: React.FC = () => {
  const { isAdmin } = useAuth();
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERENCIAMENTO">
        <NavLink icon={RiArchiveLine} label="Produtos" href="/products" />
        <NavLink icon={RiShoppingCartLine} label="Vendas" href="/sales" />
      </NavSection>
      {isAdmin && (
        <NavSection title="PESSOAS">
          <NavLink icon={RiContactsLine} label="Clientes" href="/clients" />
        </NavSection>
      )}
    </Stack>
  );
};
