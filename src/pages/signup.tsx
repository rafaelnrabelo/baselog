import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { RiLogoutBoxLine } from "react-icons/ri";

import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import validator from "validator";
import { Logo } from "../components/Header/Logo";
import Link from "next/link";
import { useApi } from "../contexts/ApiContext";

interface FormErrors {
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
}

const Signup: NextPage = () => {
  const { token } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { client } = useApi();

  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      router.replace("/products");
    }
  }, [token]);

  const handleValidation = () => {
    const newErrors: FormErrors = {};
    if (validator.isEmpty(firstName || "")) {
      newErrors.firstName = true;
    }
    if (validator.isEmpty(lastName || "")) {
      newErrors.lastName = true;
    }

    if (validator.isEmpty(email || "")) {
      newErrors.email = true;
    }
    if (!validator.isEmail(email || "")) {
      newErrors.email = true;
    }

    if (validator.isEmpty(password || "")) {
      newErrors.password = true;
    }
    if (!validator.isLength(password || "", { min: 8, max: 60 })) {
      newErrors.password = true;
    }

    if (validator.isEmpty(confirmPassword || "")) {
      newErrors.confirmPassword = true;
    }
    if (!validator.isLength(confirmPassword || "", { min: 8, max: 60 })) {
      newErrors.confirmPassword = true;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
    }

    return newErrors;
  };

  const handleLogin = async () => {
    const newErrors = handleValidation();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setErrors({});

    try {
      setLoading(true);
      await client.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });
      toast({
        title: "Cadastro realizado com sucesso!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
      router.replace("/");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Falha ao fazer o cadastro, tente novamente.",
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
        <title>Cadastro | baselog</title>
      </Head>
      <Flex
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
        flexDir={{ lg: "row", base: "column" }}
        px="6"
      >
        <Flex mb={{ lg: 0, base: 10 }}>
          <Logo w={{ lg: 64, base: "auto" }} fontSize="3xl" />
        </Flex>
        <Flex
          as="form"
          w="100%"
          maxW={600}
          bg="gray.800"
          p={8}
          borderRadius={8}
          flexDir="column"
        >
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="firstName"
                label="Nome *"
                isRequired
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isInvalid={errors.firstName}
              />
              <Input
                name="lastName"
                label="Sobrenome *"
                isRequired
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                isInvalid={errors.lastName}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
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
                name="password"
                label="Senha *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                isInvalid={errors.password}
              />
              <Input
                name="confirmPassword"
                label="Confirmação da Senha *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                isInvalid={errors.confirmPassword}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt={6}>
            <Link href={"/"} passHref>
              <IconButton
                aria-label="go back"
                colorScheme="whiteAlpha"
                as="a"
                mr={2}
                size="lg"
                icon={<RiLogoutBoxLine size={24} />}
              />
            </Link>
            <Button
              onClick={handleLogin}
              colorScheme="blue"
              isLoading={loading}
              w="100%"
              size="lg"
            >
              Cadastrar
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Signup;
