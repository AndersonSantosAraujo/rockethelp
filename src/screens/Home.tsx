import {
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
  useTheme,
  FlatList,
  Center,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import Logo from "../assets/logo_secondary.svg";
import { SignOut } from "phosphor-react-native";
import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import { useState } from "react";
import { Order, OrderProps } from "../components/Order";
import { ChatTeardropText } from "phosphor-react-native";

export default function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [statusSelected, setStatusSelected] = useState<"opened" | "closed">(
    "opened",
  );
  const [orders, setOrders] = useState<OrderProps[]>([
    {
      id: "123",
      patrimony: "123456",
      when: "18/07/2022 às 10:00",
      status: "opened",
    },
  ]);

  function handleNewOrder() {
    navigation.navigate("new");
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Solicitações</Heading>

          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="opened"
            title="em andamento"
            onPress={() => setStatusSelected("opened")}
            isActive={statusSelected === "opened"}
          />
          <Filter
            type="closed"
            title="finalizados"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Order data={item} onPress={() => handleOpenDetails(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                solicitações{" "}
                {statusSelected === "opened" ? "em andamento" : "finalizadas"}
              </Text>
            </Center>
          )}
        />

        <Button title="Nova Solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
