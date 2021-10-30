import type { NextPage, GetServerSideProps } from "next";
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
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { api } from "../../services/api";
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
}

interface ClientListProps {
  baseClients: Client[];
}

const ClientList: NextPage<ClientListProps> = ({ baseClients }) => {
  const [clients, setClients] = useState(baseClients || []);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const moneyParser = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const toast = useToast();
  const router = useRouter();

  const handleProductDelete = async (clienteId: string) => {
    try {
      await api.delete(`/customers/${clienteId}`);
      const newClients = clients.filter(
        (client) => client.id !== clienteId
      );
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
        description: error.response.data.message,
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
              <Link href="/clients/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Criar novo
                </Button>
              </Link>
            </Flex>

            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th>Cliente</Th>
                  {isWideVersion && <Th>Nome</Th>}
                  {isWideVersion && <Th>E-mail</Th>}
                  {isWideVersion && <Th>CPF</Th>}
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
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{client.name}</Text>
                      </Box>
                    </Td>
                    {isWideVersion && <Td>{client.email}</Td>}
                    {isWideVersion && <Td>{client.cpf}</Td>}
                    {isWideVersion && (
                      <Td>
                        <Button
                          as="a"
                          size="sm"
                          fontSize="sm"
                          cursor="pointer"
                          colorScheme="red"
                          leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
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
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ClientList;

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await api.get<Client[]>("/customers");

  return {
    props: { baseClients: response.data },
  };
};
