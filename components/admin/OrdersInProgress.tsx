"use client"

import { Order, OrderStatus } from "@/types/order"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useState } from "react"
import OrderEditForm from "./OrderEditForm"

interface Props {
  orders: Order[]
  setOrders: (orders: Order[]) => void
}

export default function OrdersInProgress({ orders, setOrders }: Props) {
  const confirmedOrders = orders.filter((o) => o.status === "confirmed")
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status })
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders In Progress</h2>
      <p className="text-gray-600 mb-4">
        Confirmed orders being prepared. Mark as ready when prepared for delivery.
      </p>

      {confirmedOrders.length === 0 ? (
        <p className="text-gray-500 italic">No orders in progress</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total (TND)</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {confirmedOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">{order.phone}</td>
                  <td className="p-3 text-sm">{order.address}</td>
                  <td className="p-3">
                    <ul className="text-sm">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.fruitName} - {item.quantityKg}kg
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 font-semibold">
                    {(order.totalPrice / 1000).toFixed(3)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => updateStatus(order.id!, "ready")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Mark as Ready
                      </button>
                      <button
                        onClick={() => updateStatus(order.id!, "canceled")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingOrder && (
        <OrderEditForm
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  )
}
