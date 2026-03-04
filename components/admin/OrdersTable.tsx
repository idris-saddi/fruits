"use client"

import { Order, OrderStatus } from "@/types/order"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Props {
  orders: Order[]
  setOrders: (orders: Order[]) => void
}

export default function OrdersTable({ orders, setOrders }: Props) {
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status })
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-primary text-secondary">
        <tr>
          <th className="p-2">Customer</th>
          <th className="p-2">Items</th>
          <th className="p-2">Total (TND)</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="p-2">{order.customerName}</td>
            <td className="p-2">
              {order.items.map((i) => i.fruitName).join(", ")}
            </td>
            <td className="p-2">{(order.totalPrice / 1000).toFixed(3)}</td>
            <td className="p-2">{order.status}</td>
            <td className="p-2 flex gap-2">
              {[
                "in_review",
                "confirmed",
                "ready",
                "delivered",
                "canceled",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    updateStatus(order.id!, s as OrderStatus)
                  }
                  className="bg-primary text-secondary px-2 py-1 rounded hover:bg-red-900 text-sm"
                >
                  {s}
                </button>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}