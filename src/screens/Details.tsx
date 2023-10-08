import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Box, HStack, ScrollView, Text, VStack, useTheme } from "native-base";
import { Header } from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { OrderProps } from "../components/Order";
import { OrderFireStoreDTO } from "../DTOs/OrderFireStoreDTO";
import { dateFormat } from "../utils/firestoreDateFormat";
import Loading from "../components/Loading";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  ClipboardText,
} from "phosphor-react-native";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export default function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [solution, setSolution] = useState("");

  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    firestore()
      .collection<OrderFireStoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          createdAt,
          closedAt,
          solution,
        } = doc.data();

        const closed = closedAt ? dateFormat(closedAt) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(createdAt),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação!",
      );
    }

    firestore()
      .collection<OrderFireStoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada!");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        return Alert.alert(
          "Solicitação",
          "Erro ao tentar encerrar a solicitação!",
        );
      });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails
          title="Descrição do Problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "opened" && (
            <Input
              bg="gray.600"
              placeholder="Descrição da Solução"
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
            />
          )}
        </CardDetails>
      </ScrollView>

      {!order.closed && (
        <Button
          title="Encerrar Solicitação"
          m={5}
          onPress={handleOrderClose}
          isLoading={isLoading}
        />
      )}
    </VStack>
  );
}
