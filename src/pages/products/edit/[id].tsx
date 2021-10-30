import { useState } from "react";
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
} from "@chakra-ui/react";
import { RiSaveLine } from "react-icons/ri";
import validator from "validator";

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { Input } from "../../../components/Form/Input";
import { api } from "../../../services/api";

interface Product {
  id: string;
  name: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
}

interface EditProductProps {
  product: Product;
}

interface FormErrors {
  name?: boolean;
  description?: boolean;
  quantity?: boolean;
  purchasePrice?: boolean;
  salePrice?: boolean;
}

const EditProduct: NextPage<EditProductProps> = ({ product }) => {
  const [name, setName] = useState<string>(product.name);
  const [description, setDescription] = useState<string>(
    product?.description || ""
  );
  const [quantity, setQuantity] = useState<number>(product.quantity);
  const [purchasePrice, setPurchasePrice] = useState<number>(
    product.purchasePrice
  );
  const [salePrice, setSalePrice] = useState<number>(product.salePrice);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();
  const toast = useToast();

  const handleValidation = () => {
    const requiredData = {
      name,
      quantity,
      purchasePrice,
      salePrice,
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

    if (!validator.isNumeric(String(purchasePrice || ""))) {
      newErrors.purchasePrice = true;
    }

    if (!validator.isNumeric(String(salePrice || ""))) {
      newErrors.salePrice = true;
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
      await api.put(`/products/${product.id}`, {
        name,
        description,
        quantity,
        purchasePrice,
        salePrice,
      });

      toast({
        title: "Produto atualizado com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      router.replace(`/products/${product.id}`);
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar produto, tente novamente.",
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
        <title>Editar Produto | baselog</title>
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
                  name="quantity"
                  label="Quantidade em Estoque *"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
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
                <Input
                  name="purchasePrice"
                  label="Preço de Compra *"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  isInvalid={errors.purchasePrice}
                />
                <Input
                  name="salePrice"
                  label="Preço de Venda *"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  isInvalid={errors.salePrice}
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href={`/products/${product.id}`} passHref>
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

export default EditProduct;

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
