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
  CircularProgress,
} from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import { useApi } from "../../contexts/ApiContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

const ShowProduct: NextPage = () => {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(false);
  const moneyParser = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const { token, authLoading, isAdmin } = useAuth();
  const { client } = useApi();
  const router = useRouter();

  const { id } = router.query;
  useEffect(() => {
    if (!token && !authLoading) {
      router.replace("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    getProduct();
  }, [client]);

  const getProduct = async () => {
    if (client && id) {
      setLoading(true);
      const response = await client.get<Product>(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Produtos | baselog</title>
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
                      name="name"
                      label="Nome"
                      isRequired
                      value={product?.name}
                      isReadOnly
                    />
                    <Input
                      name="price"
                      label="Preço"
                      value={moneyParser.format(product?.price || 0)}
                      isReadOnly
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      name="description"
                      label="Descrição"
                      value={product?.description}
                      isReadOnly
                    />
                  </SimpleGrid>
                </VStack>

                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Link href="/products" passHref>
                      <Button colorScheme="whiteAlpha" as="a">
                        Voltar
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href={`/products/edit/${product?.id}`} passHref>
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

export default ShowProduct;
