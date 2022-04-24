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
  Tfoot,
  Text,
  useBreakpointValue,
  useToast,
  CircularProgress,
} from "@chakra-ui/react";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useApi } from "../../contexts/ApiContext";
import { useAuth } from "../../contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

interface ProductListProps {
  baseProducts: Product[];
}

const ProductList: NextPage<ProductListProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { client } = useApi();
  const { token, authLoading, isAdmin } = useAuth();

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

  useEffect(() => {
    if (!token && !authLoading) {
      router.replace("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    getProducts();
  }, [client]);

  const getProducts = async () => {
    if (client) {
      setLoading(true);
      const response = await client.get<Product[]>("/products");
      setProducts(response.data);
      setLoading(false);
    }
  };

  const handleProductDelete = async (productId: string) => {
    try {
      await client.delete(`/products/${productId}`);
      const newProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(newProducts);
      toast({
        title: "Produto removido com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Falha ao remover produto, tente novamente.",
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
        <title>Produtos | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Produtos
              </Heading>
              {isAdmin && (
                <Link href="/products/create" passHref>
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
              )}
            </Flex>

            {loading ? (
              <Flex w="100%" mt={20}>
                <CircularProgress mx="auto" isIndeterminate />
              </Flex>
            ) : (
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th>Produto</Th>
                    <Th>Preço</Th>
                    {isWideVersion && isAdmin && <Th w="8"></Th>}
                  </Tr>
                </Thead>
                <Tbody>
                  {products.map((product) => (
                    <Tr
                      key={product.id}
                      role="link"
                      cursor="pointer"
                      transition="backdrop-filter 0.2s"
                      _hover={{
                        backdropFilter: "brightness(1.15)",
                      }}
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <Td>
                        <Box>
                          <Text fontWeight="bold">{product.name}</Text>
                          {product.description && (
                            <Text fontSize="sm" color="gray.300">
                              {product.description}
                            </Text>
                          )}
                        </Box>
                      </Td>
                      <Td>{moneyParser.format(product.price)}</Td>
                      {isWideVersion && isAdmin && (
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
                              handleProductDelete(product.id);
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

export default ProductList;
