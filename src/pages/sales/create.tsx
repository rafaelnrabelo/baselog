import { useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Icon,
  Button,
  VStack,
  HStack,
  Heading,
  Divider,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { RiSaveLine } from "react-icons/ri";
import validator from "validator";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import { api } from "../../services/api";

import { Select } from "../../components/Form/Select";
interface FormErrors {
  productId?: boolean;
  customerId?: boolean;
  saleDate?: boolean;
  quantity?: boolean;
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
interface SalesListProps {
  baseProducts: Product[];
  baseClients: Client[];
}

const CreateProduct: NextPage<SalesListProps> = ({
  baseClients,
  baseProducts,
}) => {
  const [clients] = useState<Client[]>(baseClients || []);
  const [products] = useState<Product[]>(baseProducts || []);

  const [productId, setProductId] = useState<string>();
  const [customerId, setCustomerId] = useState<string>();
  const [saleDate, setSaleDate] = useState<string>();
  const [quantity, setQuantity] = useState<number>();

  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();
  const toast = useToast();

  const handleValidation = () => {
    const requiredData = {
      productId,
      customerId,
      saleDate,
      quantity,
    };
    const newErrors: FormErrors = {};
    Object.keys(requiredData).forEach((key) => {
      if (
        validator.isEmpty(
          String(requiredData[key as keyof typeof requiredData] || "")
        )
      ) {
        newErrors[key as keyof FormErrors] = true;
      }
    });

    if (!validator.isInt(String(quantity || ""))) {
      newErrors.quantity = true;
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = handleValidation();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/sales", {
        productId,
        customerId,
        saleDate,
        quantity,
      });

      toast({
        title: "Venda criada com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      router.replace("/sales");
    } catch (error: any) {
      toast({
        title: "Falha ao criar a venda, tente novamente.",
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
        <title>Criar Venda | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <Heading size="lg" fontWeight="normal">
              Criar Venda
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Select
                  name="productId"
                  label="Produtos *"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  options={products.map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                  isInvalid={errors.productId}
                />
                <Select
                  name="customerId"
                  label="Clientes *"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  options={clients.map((client) => ({
                    label: client.name,
                    value: client.id,
                  }))}
                  isInvalid={errors.customerId}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="saleDate"
                  label="Data de Venda *"
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  isInvalid={errors.saleDate}
                />
                <Input
                  name="quantity"
                  label="Quantidade *"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  isInvalid={errors.quantity}
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/sales" passHref>
                  <Button colorScheme="whiteAlpha" as="a">
                    Cancelar
                  </Button>
                </Link>
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  leftIcon={<Icon as={RiSaveLine} fontSize="20" />}
                >
                  Salvar
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default CreateProduct;

export const getServerSideProps: GetServerSideProps = async () => {
  const resultClients = await api.get<Client[]>("/customers");
  const resultProducts = await api.get<Product[]>("/products");

  return {
    props: {
      baseClients: resultClients.data,
      baseProducts: resultProducts.data,
    },
  };
};
