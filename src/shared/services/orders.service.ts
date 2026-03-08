import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/shared/lib/firebase"
import { Order, OrderStatus } from "@/types/order"

export async function createOrder(order: Order) {
  return await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp(),
  })
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), { status })
}

export async function updateOrderDetails(
  orderId: string,
  data: Partial<Order>
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), data)
}
