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
import { useAuth } from "../../../contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

interface FormErrors {
  name?: boolean;
  description?: boolean;
  price?: boolean;
}

const EditProduct: NextPage = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const { token, authLoading, isAdmin } = useAuth();
  const { client } = useApi();

  const router = useRouter();
  const toast = useToast();

  const { id } = router.query;

  useEffect(() => {
    if (!token && !authLoading) {
      router.replace("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/products");
    }
  }, [isAdmin, authLoading]);

  useEffect(() => {
    getProduct();
  }, [client]);

  const getProduct = async () => {
    if (client && id) {
      setLoading(true);
      const response = await client.get<Product>(`/products/${id}`);

      const { name, description, price } = response.data;
      setName(name);
      setDescription(description || "");
      setPrice(Number(price));

      setLoading(false);
    }
  };

  const handleValidation = () => {
    const requiredData = {
      name,
      price,
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

    if (!validator.isNumeric(String(price || ""))) {
      newErrors.price = true;
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
      await client.put(`/products/${id}`, {
        name,
        description,
        price: price.toFixed(2),
      });

      toast({
        title: "Produto atualizado com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      router.replace(`/products/${id}`);
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar produto, tente novamente.",
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
        <title>Editar Produto | baselog</title>
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
                <Heading size="lg" fontWeight="normal">
                  Editar Produto
                </Heading>

                <Divider my="6" borderColor="gray.700" />

                <VStack spacing="8">
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      name="name"
                      label="Nome *"
                      isRequired
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      isInvalid={errors.name}
                    />
                    <Input
                      name="price"
                      label="Preço *"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      isInvalid={errors.price}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      isInvalid={errors.description}
                    />
                  </SimpleGrid>
                </VStack>

                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Link href={`/products/${id}`} passHref>
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

export default EditProduct;
