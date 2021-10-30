import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, Flex, VStack, Text, theme } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

const options: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      "2021-09-23T00:00:00.000Z",
      "2021-09-24T00:00:00.000Z",
      "2021-09-25T00:00:00.000Z",
      "2021-09-26T00:00:00.000Z",
      "2021-09-27T00:00:00.000Z",
      "2021-09-28T00:00:00.000Z",
      "2021-09-29T00:00:00.000Z",
    ],
  },
  fill: {
    opacity: 0.3,
    type: "gradient",
    gradient: {
      shade: "dark",
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [
  {
    name: "series1",
    data: [31, 120, 10, 28, 61, 18, 109],
  },
];

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | baselog</title>
      </Head>
      <Flex direction="column" h="100vh">
        <Header />

        <Flex w="100%" mb="6" maxW={1480} mx="auto" px="6">
          <Sidebar />

          <VStack flex="1" align="flex-start" mb="4">
            <Box
              p={["6", "8"]}
              bg="gray.800"
              borderRadius={8}
              pb="4"
              w={{ "2xl": "100%", xl: "90%" }}
              mb="4"
            >
              <Text fontSize="lg" mb="4">
                Inscritos da semana
              </Text>
              <Chart
                type="area"
                height={250}
                options={options}
                series={series}
              />
            </Box>
            <Box
              p={["6", "8"]}
              bg="gray.800"
              borderRadius={8}
              w={{ "2xl": "100%", xl: "90%" }}
            >
              <Text fontSize="lg" mb="4">
                Taxa de abertura
              </Text>
              <Chart
                type="area"
                height={250}
                options={options}
                series={series}
              />
            </Box>
          </VStack>
        </Flex>
      </Flex>
    </>
  );
};

export default Dashboard;
