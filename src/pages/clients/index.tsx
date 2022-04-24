import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Heading,
  Button,
  Icon,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  useBreakpointValue,
  useToast,
  CircularProgress,
} from "@chakra-ui/react";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useApi } from "../../contexts/ApiContext";
import { useAuth, User } from "../../contexts/AuthContext";

const ClientList: NextPage = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const { client: apiClient } = useApi();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const toast = useToast();
  const router = useRouter();
  const { token, authLoading } = useAuth();

  useEffect(() => {
    getClients();
  }, [apiClient]);

  const getClients = async () => {
    if (apiClient) {
      setLoading(true);
      const response = await apiClient.get<User[]>("/users");
      setClients(response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token && !authLoading) {
      router.replace("/");
    }
  }, [token, authLoading]);

  const handleProductDelete = async (clienteId: string) => {
    try {
      await apiClient.delete(`/users/${clienteId}`);
      const newClients = clients.filter((client) => client.id !== clienteId);
      setClients(newClients);
      toast({
        title: "Cliente removido com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Falha ao remover cliente, tente novamente.",
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
        <title>Clientes | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Clientes
              </Heading>
            </Flex>

            {loading ? (
              <Flex w="100%" mt={20}>
                <CircularProgress mx="auto" isIndeterminate />
              </Flex>
            ) : (
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>E-mail</Th>
                    {isWideVersion && <Th w="8"></Th>}
                  </Tr>
                </Thead>
                <Tbody>
                  {clients.map((client) => (
                    <Tr
                      key={client.id}
                      role="link"
                      cursor="pointer"
                      transition="backdrop-filter 0.2s"
                      _hover={{
                        backdropFilter: "brightness(1.15)",
                      }}
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      <Td fontWeight="bold">
                        {client.firstName} {client.lastName}
                      </Td>
                      <Td>{client.email}</Td>
                      {isWideVersion && (
                        <Td>
                          <Button
                            as="a"
                            size="sm"
                            fontSize="sm"
                            cursor="pointer"
                            colorScheme="red"
                            leftIcon={
                              <Icon as={RiDeleteBinLine} fontSize="16" />
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductDelete(client.id);
                            }}
                          >
                            Deletar
                          </Button>
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ClientList;
