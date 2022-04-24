import { useEffect, useState } from "react";
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

import { Select } from "../../components/Form/Select";
import { useApi } from "../../contexts/ApiContext";
import { useAuth, User } from "../../contexts/AuthContext";
interface FormErrors {
  productId?: boolean;
  userId?: boolean;
  quantity?: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

const CreateProduct: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [productId, setProductId] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [quantity, setQuantity] = useState<number>();

  const [errors, setErrors] = useState<FormErrors>({});

  const { client } = useApi();
  const { authLoading, isAdmin, token } = useAuth();

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!token && !authLoading) {
      router.replace("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/sales");
    }
  }, [isAdmin, authLoading]);

  useEffect(() => {
    getItems();
  }, [client]);

  const getItems = async () => {
    setLoading(true);
    await getProducts();
    await getUsers();
    setLoading(false);
  };

  const getProducts = async () => {
    if (client) {
      const response = await client.get<Product[]>(`/products`);
      setProducts(response.data);
    }
  };

  const getUsers = async () => {
    if (client) {
      const response = await client.get<User[]>(`/users`);
      setUsers(response.data);
    }
  };

  const handleValidation = () => {
    const requiredData = {
      productId,
      userId,
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
    setErrors({});

    try {
      await client.post("/sales", {
        productId,
        userId,
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
                  name="userId"
                  label="Clientes *"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  options={users?.map((user) => ({
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.id,
                  }))}
                  isInvalid={errors.userId}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
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
