/* eslint-disable import/no-extraneous-dependencies */
import React, { createContext, useState, useContext, useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import { useAuth } from "./AuthContext";
import { useToast } from "@chakra-ui/react";

interface ApiState {
  client: AxiosInstance;
}

interface ApiContextData {
  client: AxiosInstance;
}

const ApiContext = createContext<ApiContextData>({} as ApiContextData);

interface Props {
  children: any;
}

const ApiProvider: React.FC<Props> = ({ children }) => {
  const [contextData, setContextData] = useState<ApiState>({} as ApiState);
  const { token, signOut } = useAuth();
  const toast = useToast();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  });

  async function getToken() {
    if (token) return token;
    return localStorage.getItem("@BaseLog:token");
  }

  useEffect(() => {
    api.interceptors.request.use(
      async (request) => {
        const authToken = await getToken();
        if (authToken) {
          request.headers = {
            Authorization: `Bearer ${authToken}`,
          };
        }
        return request;
      },
      (error) => {
        throw error;
      }
    );

    api.interceptors.response.use(
      async (response) => {
        return response;
      },
      async (error) => {
        const { status } = error.response;
        if (status === 401) {
          const authToken = await getToken();
          if (authToken) {
            toast({
              title: "Login expirado, faça login novamente.",
              status: "error",
              duration: 9000,
              position: "top-right",
              isClosable: true,
            });
            signOut();
          }
          throw error;
        } else {
          throw error;
        }
      }
    );

    setContextData({ client: api });
  }, [token]);

  return (
    <ApiContext.Provider value={{ client: contextData.client }}>
      {children}
    </ApiContext.Provider>
  );
};

function useApi(): ApiContextData {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }

  return context;
}

export { ApiProvider, useApi };
