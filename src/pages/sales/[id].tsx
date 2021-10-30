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

interface Product {
  id: string;
  name: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
}

interface ShowProductProps {
  product: Product;
}

const ShowProduct: NextPage<ShowProductProps> = ({ product }) => {
  const moneyParser = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <>
      <Head>
        <title>{product.name} | baselog</title>
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
                  value={product.name}
                  isReadOnly
                />
                <Input
                  name="quantity"
                  label="Quantidade em Estoque"
                  value={product.quantity}
                  isReadOnly
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="description"
                  label="Descrição"
                  value={product.description}
                  isReadOnly
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="purchasePrice"
                  label="Preço de Compra"
                  value={moneyParser.format(product.purchasePrice)}
                  isReadOnly
                />
                <Input
                  name="salePrice"
                  label="Preço de Venda"
                  value={moneyParser.format(product.salePrice)}
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
                <Link href={`/products/edit/${product.id}`} passHref>
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

export default ShowProduct;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    const response = await api.get<Product>(`/products/${id}`);

    return {
      props: { product: response.data },
    };
  } catch {
    return {
      props: {},
      notFound: true,
    };
  }
};
