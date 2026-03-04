import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import { Fruit } from "@/types/fruit"

export async function getAvailableFruits(): Promise<Fruit[]> {
  const q = query(
    collection(db, "fruits"),
    where("isAvailable", "==", true)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Fruit[]
}