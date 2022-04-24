import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Icon,
  Button,
  VStack,
  HStack,
  Heading,
  Divider,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { RiSaveLine } from "react-icons/ri";
import validator from "validator";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Input } from "../components/Form/Input";
import { useApi } from "../contexts/ApiContext";
import { useAuth } from "../contexts/AuthContext";

interface FormErrors {
  currentPassword?: boolean;
  newPassword?: boolean;
  newPasswordConfirmation?: boolean;
}

const Me: NextPage = () => {
  const { token, authLoading, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
    useState<string>();
  const [errors, setErrors] = useState<FormErrors>({});

  const { client: apiClient } = useApi();

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!token && !authLoading) {
      router.replace("/");
    }
  }, [token, authLoading]);

  const handleValidation = () => {
    const requiredData = {
      newPassword,
      newPasswordConfirmation,
      currentPassword,
    };
    const newErrors: FormErrors = {};
    Object.keys(requiredData).forEach((key) => {
      if (
        validator.isEmpty(requiredData[key as keyof typeof requiredData] || "")
      ) {
        newErrors[key as keyof FormErrors] = true;
      }
      if (
        !validator.isLength(
          requiredData[key as keyof typeof requiredData] || "",
          { min: 8, max: 60 }
        )
      ) {
        newErrors[key as keyof FormErrors] = true;
      }
    });

    if (newPassword === currentPassword) {
      newErrors.newPassword = true;
      toast({
        title: "A nova senha não pode ser igual a atual.",
        status: "error",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    }

    if (newPassword !== newPasswordConfirmation) {
      newErrors.newPasswordConfirmation = true;
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = handleValidation();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await apiClient.put(`/auth/change-password`, {
        currentPassword,
        newPassword,
        newPasswordConfirmation,
      });

      toast({
        title: "Senha atualizada com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });

      router.back();
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar senha, tente novamente.",
        status: "error",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Perfil | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <Heading size="lg" fontWeight="normal">
              Perfil
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="firstName"
                  label="Nome"
                  value={user?.firstName}
                  isReadOnly
                />
                <Input
                  name="lastName"
                  label="Sobrenome"
                  value={user?.lastName}
                  isReadOnly
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="email"
                  label="E-mail"
                  value={user?.email}
                  isReadOnly
                />
                <Input
                  name="role"
                  label="Tipo"
                  value={user?.role === "ADMIN" ? "Administrador" : "Cliente"}
                  isReadOnly
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="160px" spacing={["6", "8"]} w="100%">
                <Input
                  name="currentPassword"
                  label="Senha Atual *"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  isInvalid={errors.currentPassword}
                  isRequired
                />
                <Input
                  name="newPassword"
                  label="Nova Senha *"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  isInvalid={errors.newPassword}
                  isRequired
                />
                <Input
                  name="newPasswordConfirmation"
                  label="Confirmação da Nova Senha *"
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  type="password"
                  isInvalid={errors.newPasswordConfirmation}
                  isRequired
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  leftIcon={<Icon as={RiSaveLine} fontSize="20" />}
                >
                  Salvar
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Me;
