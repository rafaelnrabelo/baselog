import {
  Flex,
  Box,
  Text,
  Avatar,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuth, User } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData?: boolean;
  profileData: User;
}

const Profile: React.FC<ProfileProps> = ({
  showProfileData = true,
  profileData,
}) => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLoggout = () => {
    signOut();
  };

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>
            {profileData.firstName} {profileData.lastName}
          </Text>
          <Text color="gray.300" fontSize="small">
            {profileData.email}
          </Text>
          <Text color="gray.300" fontSize="small">
            {profileData.role === "ADMIN" ? "Admin" : "Cliente"}
          </Text>
        </Box>
      )}
      <Menu>
        <MenuButton>
          <Avatar
            size="md"
            name={`${profileData.firstName} ${profileData.lastName}`}
            bg="blue.500"
          />
        </MenuButton>
        <MenuList bg="gray.800" borderColor="gray.700">
          <MenuItem
            _focus={{ bg: "gray.700" }}
            _active={{ bg: "gray.700" }}
            onClick={() => router.push("/me")}
          >
            Perfil
          </MenuItem>
          <MenuItem
            _focus={{ bg: "gray.700" }}
            _active={{ bg: "gray.700" }}
            onClick={handleLoggout}
          >
            Sair
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Profile;
