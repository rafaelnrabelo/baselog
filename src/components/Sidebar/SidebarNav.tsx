import { Stack } from "@chakra-ui/react";
import {
  RiContactsLine,
  RiDashboardLine,
  RiGitMergeLine,
  RiInputMethodLine,
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
        <NavLink icon={RiContactsLine} label="Usuários" href="/users" />
        <NavLink icon={RiArchiveLine} label="Produtos" href="/products" />
      </NavSection>
      <NavSection title="AUTOMAÇÃO">
        <NavLink icon={RiInputMethodLine} href="/forms" label="Formulários" />
        <NavLink icon={RiGitMergeLine} href="/automations" label="Automação" />
      </NavSection>
    </Stack>
  );
};

export default SidebarNav;
