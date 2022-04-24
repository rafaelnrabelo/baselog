import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  CircularProgress,
} from "@chakra-ui/react";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import { useApi } from "../../contexts/ApiContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "../../contexts/AuthContext";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ShowClientProps {
  client: Client;
}

const ShowClient: NextPage<ShowClientProps> = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const { client } = useApi();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    getUser();
  }, [client, id]);

  const getUser = async () => {
    if (client && id) {
      setLoading(true);
      const response = await client.get<User>(`/users/${id}`);
      setUser(response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cliente | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            {loading ? (
              <Flex w="100%" h="100%">
                <CircularProgress
                  mx="auto"
                  isIndeterminate
                  mt="auto"
                  mb="auto"
                />
              </Flex>
            ) : (
              <>
                <VStack spacing="8">
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      name="firstName"
                      label="Nome"
                      isRequired
                      value={user?.firstName}
                      isReadOnly
                    />
                    <Input
                      name="lastName"
                      label="Sobrenome"
                      isRequired
                      value={user?.lastName}
                      isReadOnly
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      name="email"
                      label="E-mail"
                      isRequired
                      value={user?.email}
                      isReadOnly
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
                  </HStack>
                </Flex>
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ShowClient;
