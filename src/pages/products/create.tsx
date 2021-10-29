import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import { NumberInput } from "../../components/Form/NumberInput";
import { api } from "../../services/api";

interface FormErrors {
  name?: boolean;
  description?: boolean;
  quantity?: boolean;
  purchasePrice?: boolean;
  salePrice?: boolean;
}

const CreateProduct: NextPage = () => {
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [quantity, setQuantity] = useState<number>();
  const [purchasePrice, setPurchasePrice] = useState<number>();
  const [salePrice, setSalePrice] = useState<number>();
  const [errors, setErrors] = useState<FormErrors>({});

  const handleValidation = () => {
    const requiredData = {
      name,
      quantity,
      purchasePrice,
      salePrice,
    };
    const newErrors: FormErrors = {};
    Object.keys(requiredData).forEach((key) => {
      if (!requiredData[key as keyof typeof requiredData]) {
        newErrors[key as keyof FormErrors] = true;
      }
    });
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = handleValidation();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response = await api.post("/products", {
      name,
      description,
      quantity,
      purchasePrice,
      salePrice,
    });
    console.log(response);
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
                <NumberInput
                  name="quantity"
                  label="Quantidade em Estoque *"
                  precision={0}
                  value={quantity}
                  onChange={(_, valueAsNumber) => setQuantity(valueAsNumber)}
                  isInvalid={errors.quantity}
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
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <NumberInput
                  name="purchasePrice"
                  label="Preço de Compra *"
                  precision={2}
                  value={purchasePrice}
                  onChange={(_, valueAsNumber) =>
                    setPurchasePrice(valueAsNumber)
                  }
                  isInvalid={errors.purchasePrice}
                />
                <NumberInput
                  name="salePrice"
                  label="Preço de Venda *"
                  precision={2}
                  value={salePrice}
                  onChange={(_, valueAsNumber) => setSalePrice(valueAsNumber)}
                  isInvalid={errors.salePrice}
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
                <Button colorScheme="blue" onClick={handleSubmit}>
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
