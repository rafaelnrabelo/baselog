import type { NextPage } from "next";
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
  CircularProgress,
} from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import { useApi } from "../../contexts/ApiContext";
import { useAuth, User } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

interface Sale {
  id: string;
  product: Product;
  user: User;
  createdAt: string;
  quantity: number;
}

const ShowSale: NextPage = () => {
  const [sale, setSale] = useState<Sale>();
  const [loading, setLoading] = useState(false);
  const { authLoading, isAdmin, token } = useAuth();
  const { client } = useApi();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!token && !authLoading) {
      router.replace("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    getSale();
  }, [client]);

  const getSale = async () => {
    if (client && id) {
      setLoading(true);
      const response = await client.get<Sale>(`/sales/${id}`);
      setSale(response.data);
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate() + 1}/${("0" + (d.getMonth() + 1)).slice(
      -2
    )}/${d.getFullYear()}`;
  };

  return (
    <>
      <Head>
        <title>Venda | baselog</title>
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
                      name="product"
                      label="Produto"
                      isRequired
                      value={sale?.product?.name}
                      isReadOnly
                    />
                    <Input
                      name="customer"
                      label="Cliente"
                      value={`${sale?.user?.firstName} ${sale?.user?.lastName}`}
                      isReadOnly
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      name="sale"
                      label="Data de Venda"
                      value={formatDate(sale?.createdAt || "")}
                      isReadOnly
                    />
                    <Input
                      name="quantity"
                      label="Quantidade"
                      value={sale?.quantity}
                      isReadOnly
                    />
                  </SimpleGrid>
                </VStack>

                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Link href="/sales" passHref>
                      <Button colorScheme="whiteAlpha" as="a">
                        Voltar
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href={`/sales/edit/${sale?.id}`} passHref>
                        <Button
                          as="a"
                          colorScheme="green"
                          leftIcon={<Icon as={RiPencilLine} fontSize="20" />}
                        >
                          Editar
                        </Button>
                      </Link>
                    )}
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

export default ShowSale;
