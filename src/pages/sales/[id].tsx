import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
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

interface Product {
  id: string;
  name: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
}

interface Sale {
  id: string;
  productId: string;
  product: Product;
  customer: Client;
  customerId: string;
  saleDate: string;
  quantity: number;
}

interface ShowSaleProps {
  sale: Sale;
}

const ShowSale: NextPage<ShowSaleProps> = ({ sale }) => {
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
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="product"
                  label="Produto"
                  isRequired
                  value={sale.product.name}
                  isReadOnly
                />
                <Input
                  name="customer"
                  label="Cliente"
                  value={sale.customer.name}
                  isReadOnly
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="sale"
                  label="Data de Venda"
                  value={formatDate(sale.saleDate)}
                  isReadOnly
                />
                <Input
                  name="quantity"
                  label="Quantidade"
                  value={sale.quantity}
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
                <Link href={`/sales/edit/${sale.id}`} passHref>
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

export default ShowSale;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id;
    const response = await api.get<Sale>(`/sales/${id}`);

    return {
      props: { sale: response.data },
      revalidate: 60 * 60 * 12, // 12h
    };
  } catch {
    return {
      props: {},
      notFound: true,
    };
  }
};
