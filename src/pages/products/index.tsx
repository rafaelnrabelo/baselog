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

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
}

interface ProductListProps {
  baseProducts: Product[];
}

const ProductList: NextPage<ProductListProps> = ({ baseProducts }) => {
  const [products, setProducts] = useState(baseProducts || []);

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

  const handleProductDelete = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
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
            </Flex>

            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  {isWideVersion && <Th>Quantidade</Th>}
                  {isWideVersion && <Th>Preço de Compra</Th>}
                  {isWideVersion && <Th>Preço de Venda</Th>}
                  {isWideVersion && <Th w="8"></Th>}
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
                    {isWideVersion && <Td>{product.quantity}</Td>}
                    {isWideVersion && (
                      <Td>{moneyParser.format(product.purchasePrice)}</Td>
                    )}
                    {isWideVersion && (
                      <Td>{moneyParser.format(product.salePrice)}</Td>
                    )}
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
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ProductList;

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await api.get<Product[]>("/products");

  return {
    props: { baseProducts: response.data },
  };
};
