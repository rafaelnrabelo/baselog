import type { NextPage, GetServerSideProps } from "next";
import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import {
  Box,
  Flex,
  VStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  Icon,
  theme,
} from "@chakra-ui/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { api } from "../services/api";

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

interface DashboardProps {
  baseAvgTicket: number;
}

const Dashboard: NextPage<DashboardProps> = ({ baseAvgTicket }) => {
  const [avgTicket, setAvgTicket] = useState(baseAvgTicket);
  const [month, setMonth] = useState(new Date());

  const moneyParser = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const monthParser = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
  });

  const getAvgTicket = async (newDate: Date) => {
    const initialDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const finalDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    );

    const response = await api.get("/avg", {
      params: {
        initialDate,
        finalDate,
      },
    });
    setAvgTicket(response.data?.avg || 0);
  };

  const handleNextMonth = () => {
    const newDate = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    setMonth(newDate);
    getAvgTicket(newDate);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    setMonth(newDate);
    getAvgTicket(newDate);
  };

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
              w="100%"
              mb="4"
              display="flex"
              alignItems="center"
            >
              <IconButton
                colorScheme="blue"
                aria-label="Anterior"
                icon={<Icon as={RiArrowLeftSLine} />}
                onClick={handlePreviousMonth}
              />
              <Stat display="flex" justifyContent="center" textAlign="center">
                <StatHelpText textTransform="capitalize" fontSize={16}>
                  {monthParser.format(month)}
                </StatHelpText>
                <StatLabel fontSize={20}>Ticket Médio</StatLabel>
                <StatNumber fontSize={36}>
                  {moneyParser.format(avgTicket)}
                </StatNumber>
              </Stat>
              <IconButton
                colorScheme="blue"
                aria-label="Próximo"
                icon={<Icon as={RiArrowRightSLine} />}
                onClick={handleNextMonth}
              />
            </Box>
            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} w="100%">
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const date = new Date();
    const initialDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const finalDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const response = await api.get("/avg", {
      params: {
        initialDate,
        finalDate,
      },
    });

    return {
      props: { baseAvgTicket: response.data?.avg || 0 },
    };
  } catch {
    return {
      props: { baseAvgTicket: 0 },
    };
  }
};
