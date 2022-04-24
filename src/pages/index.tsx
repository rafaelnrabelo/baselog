import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  Flex,
  Link,
  Stack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import validator from "validator";
import { Logo } from "../components/Header/Logo";

interface FormErrors {
  email?: boolean;
  password?: boolean;
}

const Login: NextPage = () => {
  const { authLoading, signIn, token } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (token) {
      router.replace("/products");
    }
  }, [token]);

  const handleValidation = () => {
    const newErrors: FormErrors = {};
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

    return newErrors;
  };

  const handleLogin = async () => {
    const newErrors = handleValidation();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await signIn({ email: email || "", password: password || "" });
      router.replace("/products");
    } catch (error) {
      toast({
        title: "Falha ao fazer login, tente novamente.",
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
        <title>Login | baselog</title>
      </Head>
      <Flex
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
        flexDir={{ lg: "row", base: "column" }}
      >
        <Flex mb={{ lg: 0, base: 10 }}>
          <Logo w={{ lg: 64, base: "auto" }} fontSize="3xl" />
        </Flex>
        <Flex
          as="form"
          w="100%"
          maxW={360}
          bg="gray.800"
          p={8}
          borderRadius={8}
          flexDir="column"
        >
          <Stack spacing="4">
            <Input
              name="email"
              label="E-mail"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={errors.email}
            />
            <Input
              name="password"
              label="Senha"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={errors.password}
            />
          </Stack>

          <Button
            onClick={handleLogin}
            mt={6}
            colorScheme="blue"
            size="lg"
            isLoading={authLoading}
          >
            Entrar
          </Button>

          <Link mx="auto" mt={5} href={"/signup"}>
            Não tem conta? <strong>Clique aqui</strong>
          </Link>
        </Flex>
      </Flex>
    </>
  );
};

export default Login;
