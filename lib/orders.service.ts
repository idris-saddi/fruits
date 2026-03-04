import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import { Order } from "@/types/order"

export async function createOrder(order: Order) {
  return await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp(),
  })
}