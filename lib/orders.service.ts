import { addDoc, collection, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Order } from "@/types/order";

export async function createOrder(order: Order) {
  return await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp(),
  });
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
}
