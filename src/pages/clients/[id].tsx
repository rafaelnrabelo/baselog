import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Flex,
  Icon,
  VStack,
  HStack,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import { api } from "../../services/api";
import { Select } from "../../components/Form/Select";

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

interface ShowClientProps {
  client: Client;
}

const ShowClient: NextPage<ShowClientProps> = ({ client }) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate() + 1}/${("0" + (d.getMonth() + 1)).slice(
      -2
    )}/${d.getFullYear()}`;
  };

  const genderOptions = [
    { value: "MALE", label: "Masculino" },
    { value: "FEMALE", label: "Feminino" },
    { value: "OTHER", label: "Outros" },
  ];

  return (
    <>
      <Head>
        <title>{client.name} | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="name"
                  label="Nome"
                  isRequired
                  value={client.name}
                  isReadOnly
                />
                <Input
                  name="email"
                  label="E-mail"
                  isRequired
                  value={client.email}
                  isReadOnly
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="cpf"
                  label="CPF"
                  mask="999.999.999-99"
                  isRequired
                  value={client.cpf}
                  isReadOnly
                />
                <Input
                  name="birthDate"
                  label="Data de nascimento"
                  isRequired
                  value={formatDate(client.birthDate)}
                  isReadOnly
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="gender"
                  label="Gênero"
                  value={
                    genderOptions.find(
                      (gender) => gender.value === client.gender
                    )?.label
                  }
                  isReadOnly
                  isRequired
                />

                <Input
                  name="phone"
                  label="Telefone"
                  mask="(99) 99999-9999"
                  isRequired
                  value={client.phone}
                  isReadOnly
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="address"
                  label="Endereço *"
                  value={client.address}
                  isReadOnly
                  isRequired
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/clients" passHref>
                  <Button colorScheme="whiteAlpha" as="a">
                    Voltar
                  </Button>
                </Link>
                <Link href={`/clients/edit/${client.id}`} passHref>
                  <Button
                    as="a"
                    colorScheme="green"
                    leftIcon={<Icon as={RiPencilLine} fontSize="20" />}
                  >
                    Editar
                  </Button>
                </Link>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ShowClient;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    const response = await api.get<Client>(`/customers/${id}`);

    return {
      props: { client: response.data },
    };
  } catch {
    return {
      props: {},
      notFound: true,
    };
  }
};
