import { useEffect, useState } from "react";
import type { NextPage } from "next";
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
import { useApi } from "../../contexts/ApiContext";
import { useAuth } from "../../contexts/AuthContext";

interface FormErrors {
  name?: boolean;
  description?: boolean;
  price?: boolean;
}

const CreateProduct: NextPage = () => {
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [errors, setErrors] = useState<FormErrors>({});

  const { client } = useApi();
  const { authLoading, isAdmin } = useAuth();

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/products");
    }
  }, [isAdmin, authLoading]);

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
      await client.post("/products", {
        name,
        description,
        price: price?.toFixed(2),
      });

      toast({
        title: "Produto criado com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      router.replace("/products");
    } catch (error: any) {
      toast({
        title: "Falha ao criar produto, tente novamente.",
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
        <title>Criar Produto | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <Heading size="lg" fontWeight="normal">
              Criar Produto
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="name"
                  label="Nome *"
                  isRequired
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={errors.name}
                />
                <Input
                  name="purchasePrice"
                  label="Preço *"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  isInvalid={errors.price}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
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
                <Link href="/products" passHref>
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
