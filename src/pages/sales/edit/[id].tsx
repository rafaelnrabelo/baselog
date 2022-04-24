import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
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
  CircularProgress,
} from "@chakra-ui/react";
import { RiSaveLine } from "react-icons/ri";
import validator from "validator";

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { Input } from "../../../components/Form/Input";
import { useApi } from "../../../contexts/ApiContext";
import { useAuth, User } from "../../../contexts/AuthContext";
import { Select } from "../../../components/Form/Select";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

interface FormErrors {
  productId?: boolean;
  userId?: boolean;
  quantity?: boolean;
}

interface Sale {
  id: string;
  product: Product;
  user: User;
  createdAt: string;
  quantity: number;
}

const EditSale: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<string>();
  const [user, setUser] = useState<string>();
  const [quantity, setQuantity] = useState<number>();
  const [errors, setErrors] = useState<FormErrors>({});

  const { client } = useApi();
  const { authLoading, isAdmin, token } = useAuth();

  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;

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
  }, [client, id]);

  const getItems = async () => {
    setLoading(true);
    await getSale();
    setLoading(false);
  };

  const getSale = async () => {
    if (client && id) {
      const response = await client.get<Sale>(`/sales/${id}`);
      const { product, quantity, user } = response.data;
      setProduct(product.name);
      setUser(`${user.firstName} ${user.lastName}`);
      setQuantity(quantity);
    }
  };

  const handleValidation = () => {
    const requiredData = {
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
    setErrors({});

    try {
      await client.put(`/sales/${id}`, {
        quantity,
      });

      toast({
        title: "Venda atualizada com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      router.replace(`/sales/${id}`);
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar venda, tente novamente.",
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
        <title>Editar Venda | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <Heading size="lg" fontWeight="normal">
              Editar Produto
            </Heading>

            <Divider my="6" borderColor="gray.700" />

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
                      value={product}
                      isReadOnly
                    />
                    <Input
                      name="customer"
                      label="Cliente"
                      value={user}
                      isReadOnly
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
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
                    <Link href={`/sales/${id}`} passHref>
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
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default EditSale;
