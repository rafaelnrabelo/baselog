import { useState } from "react";
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

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";

import { Select }  from '../../components/Form/Select';
import { api } from "../../services/api";

interface FormErrors {
  name?: boolean;
  email?: boolean;
  cpf?: boolean;
  birthDate?: boolean;
  phone?: boolean;
  gender?: boolean;
  address?: boolean;
}

const CreateClient: NextPage = () => {

  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [cpf, setCpf] = useState<string>();
  const [birthDate, setBirthDate] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [gender, setGender] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();
  const toast = useToast();

  const handleValidation = () => {
    const requiredData = {
      name,
      email,
      cpf,
      birthDate,
      phone,
      gender,
      address
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

    try {
      await api.post("/customers", {
        name,
        email,
        cpf,
        birthDate,
        phone,
        gender,
        address
      });

      toast({
        title: "Cliente criado com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });

      router.replace("/clients");

    } catch (error: any) {
      toast({
        title: "Falha ao criar cliente, tente novamente.",
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
        <title>Criar Cliente | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <Heading size="lg" fontWeight="normal">
              Criar Cliente
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
                  name="email"
                  label="E-mail *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={errors.email}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="cpf"
                  label="CPF *"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  isInvalid={errors.email}
                />
                <Input
                  name="birthDate"
                  label="Data de nascimento *"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  isInvalid={errors.birthDate}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Select
                  name="gender"
                  label="Gênero *"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  isInvalid={errors.gender}
                >
                  <option value="" key="first" > Selecione uma opção </option>
                  <option value="male" key="male" > Masculino </option>
                  <option value="female" key="female" > Feminino </option>
                  <option value="other" key="other" > Outros </option>
                </Select>
                <Input
                  name="phone"
                  label="Telefone *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isInvalid={errors.phone}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="address"
                  label="Endereço *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  isInvalid={errors.address}
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/clients" passHref>
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

export default CreateClient;
