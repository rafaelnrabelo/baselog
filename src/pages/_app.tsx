import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../styles/theme";
import "../styles/global.css";

import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ApiProvider } from "../contexts/ApiContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <SidebarDrawerProvider>
          <ApiProvider>
            <Component {...pageProps} />
          </ApiProvider>
        </SidebarDrawerProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
export default MyApp;
