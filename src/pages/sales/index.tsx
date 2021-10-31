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

interface Sale {
  id: string;
  productId: string;
  product: Product;
  customer: Client;
  customerId: string;
  saleDate: string;
  quantity: number;
}

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

interface SaleListProps {
  baseSales: Sale[];
}

const SaleList: NextPage<SaleListProps> = ({ baseSales }) => {
  const [sales, setSales] = useState(baseSales || []);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate() + 1}/${("0" + (d.getMonth() + 1)).slice(
      -2
    )}/${d.getFullYear()}`;
  };

  const toast = useToast();
  const router = useRouter();

  const handleProductDelete = async (saleId: string) => {
    try {
      await api.delete(`/sales/${saleId}`);
      const newSale = sales.filter((sale) => sale.id !== saleId);
      setSales(newSale);
      toast({
        title: "Venda removida com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Falha ao remover venda, tente novamente.",
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
        <title>Vendas | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Vendas
              </Heading>
              <Link href="/sales/create" passHref>
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
                  <Th>Cliente</Th>
                  {isWideVersion && <Th>Data de venda</Th>}
                  {isWideVersion && <Th w="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {sales.map((sale) => (
                  <Tr
                    key={sale.id}
                    role="link"
                    cursor="pointer"
                    transition="backdrop-filter 0.2s"
                    _hover={{
                      backdropFilter: "brightness(1.15)",
                    }}
                    onClick={() => router.push(`/sales/${sale.id}`)}
                  >
                    <Td fontWeight="bold">{sale.product.name}</Td>
                    <Td fontWeight="bold">{sale.customer.name}</Td>
                    {isWideVersion && <Td>{formatDate(sale.saleDate)}</Td>}
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
                            handleProductDelete(sale.id);
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

export default SaleList;

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await api.get<Sale[]>("/sales");

  return {
    props: { baseSales: response.data },
  };
};
