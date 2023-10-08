import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type OrderFireStoreDTO = {
  patrimony: string;
  description: string;
  status: "opened" | "closed";
  solution?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  closedAt?: FirebaseFirestoreTypes.Timestamp;
};
