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
import { Select } from "../../../components/Form/Select";

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

interface EditClientProps {
  client: Client;
}

interface FormErrors {
  name?: boolean;
  email?: boolean;
  cpf?: boolean;
  birthDate?: boolean;
  phone?: boolean;
  gender?: boolean;
  address?: boolean;
}

const EditClient: NextPage<EditClientProps> = ({ client }) => {
  const [name, setName] = useState<string>(client.name);
  const [email, setEmail] = useState<string>(client.email);
  const [cpf, setCpf] = useState<string>(client.cpf);
  const [birthDate, setBirthDate] = useState<string>(client.birthDate);
  const [phone, setPhone] = useState<string>(client.phone);
  const [gender, setGender] = useState<string>(client.gender);
  const [address, setAddress] = useState<string>(client.address);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();
  const toast = useToast();

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${
      d.getDate() + 1
    }`;
  };

  const handleValidation = () => {
    const requiredData = {
      name,
      email,
      cpf,
      birthDate,
      phone,
      gender,
      address,
    };
    const newErrors: FormErrors = {};
    Object.keys(requiredData).forEach((key) => {
      if (
        validator.isEmpty(requiredData[key as keyof typeof requiredData] || "")
      ) {
        newErrors[key as keyof FormErrors] = true;
      }
    });

    if (!validator.isMobilePhone(phone || "", "pt-BR")) {
      newErrors.phone = true;
    }

    if (!validator.isEmail(email || "")) {
      newErrors.email = true;
    }

    if (
      !validator.isLength((cpf || "").replace(/_/g, ""), { min: 14, max: 14 })
    ) {
      newErrors.cpf = true;
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
      await api.put(`/customers/${client.id}`, {
        name,
        email,
        cpf,
        birthDate,
        phone,
        gender,
        address,
      });

      toast({
        title: "Cliente atualizado com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });

      router.replace(`/clients/${client.id}`);
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar cliente, tente novamente.",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const genderOptions = [
    { value: "MALE", label: "Masculino" },
    { value: "FEMALE", label: "Feminino" },
    { value: "OTHER", label: "Outros" },
  ];

  return (
    <>
      <Head>
        <title>Editar Cliente | baselog</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <Heading size="lg" fontWeight="normal">
              Editar Cliente
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
                  mask="999.999.999-99"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  isInvalid={errors.email}
                />
                <Input
                  name="birthDate"
                  label="Data de nascimento *"
                  type="date"
                  value={formatDate(birthDate)}
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
                  options={genderOptions}
                  isInvalid={errors.gender}
                />

                <Input
                  name="phone"
                  label="Telefone *"
                  mask="(99) 99999-9999"
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
                <Link href={`/clients/${client.id}`} passHref>
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

export default EditClient;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    const response = await api.get<Client>(`/customers/${id}`);

    return {
      props: { client: response.data },
    };
  } catch {
    return {
      props: {},
      notFound: true,
    };
  }
};
