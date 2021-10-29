import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
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
} from "@chakra-ui/react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../components/Pagination";

const ProductList: NextPage = () => {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

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
                  {isWideVersion && <Th w="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">Arroz</Text>
                      <Text fontSize="sm" color="gray.300">
                        Saco de 5Kg
                      </Text>
                    </Box>
                  </Td>
                  {isWideVersion && <Td>20</Td>}
                  {isWideVersion && <Td>R$ 20,50</Td>}
                  {isWideVersion && <Td>R$ 39,99</Td>}
                  {isWideVersion && (
                    <Td>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="purple"
                        leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                      >
                        Editar
                      </Button>
                    </Td>
                  )}
                  {isWideVersion && (
                    <Td>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="red"
                        leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                      >
                        Deletar
                      </Button>
                    </Td>
                  )}
                </Tr>
                <Tr>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">Arroz</Text>
                      <Text fontSize="sm" color="gray.300">
                        Saco de 5Kg
                      </Text>
                    </Box>
                  </Td>
                  {isWideVersion && <Td>20</Td>}
                  {isWideVersion && <Td>R$ 20,50</Td>}
                  {isWideVersion && <Td>R$ 39,99</Td>}
                  {isWideVersion && (
                    <Td>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="purple"
                        leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                      >
                        Editar
                      </Button>
                    </Td>
                  )}
                  {isWideVersion && (
                    <Td>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="red"
                        leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                      >
                        Deletar
                      </Button>
                    </Td>
                  )}
                </Tr>
                <Tr>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">Arroz</Text>
                      <Text fontSize="sm" color="gray.300">
                        Saco de 5Kg
                      </Text>
                    </Box>
                  </Td>
                  {isWideVersion && <Td>20</Td>}
                  {isWideVersion && <Td>R$ 20,50</Td>}
                  {isWideVersion && <Td>R$ 39,99</Td>}
                  {isWideVersion && (
                    <Td>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="purple"
                        leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                      >
                        Editar
                      </Button>
                    </Td>
                  )}
                  {isWideVersion && (
                    <Td>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="red"
                        leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                      >
                        Deletar
                      </Button>
                    </Td>
                  )}
                </Tr>
              </Tbody>
            </Table>

            <Pagination />
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ProductList;
