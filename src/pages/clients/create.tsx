import type { NextPage } from "next";
import Link from "next/link";
import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";

const CreateUser: NextPage = () => {
  return (
    <Box>
      <Header />

      <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input name="nome" label="Nome Completo" />
              <Input name="email" label="E-mail" type="email" />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input name="password" label="Senha" type="password" />
              <Input
                name="password_confirmation"
                label="Confirmação da Senha"
                type="password"
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button colorScheme="whiteAlpha" as="a">
                  Cancelar
                </Button>
              </Link>
              <Button colorScheme="blue">Salvar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default CreateUser;
