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

export default function OrdersReview({ orders, setOrders }: Props) {
  const reviewOrders = orders.filter((o) => o.status === "in_review")
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
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Orders In Review</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        New orders awaiting review. Contact customer and confirm or decline.
      </p>

      {reviewOrders.length === 0 ? (
        <p className="text-gray-500 italic">No orders in review</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-left">Total (TND)</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviewOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{order.phone}</div>
                        <div className="text-gray-600">{order.email}</div>
                      </div>
                    </td>
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
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => updateStatus(order.id!, "confirmed")}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(order.id!, "canceled")}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {reviewOrders.map((order) => (
              <div key={order.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-2">{order.customerName}</h3>
                  <div className="text-sm space-y-1">
                    <div className="flex items-start">
                      <span className="font-semibold w-20">Phone:</span>
                      <span className="text-gray-700">{order.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold w-20">Email:</span>
                      <span className="text-gray-700">{order.email}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold w-20">Address:</span>
                      <span className="text-gray-700">{order.address}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-semibold text-sm mb-1">Items:</p>
                  <ul className="text-sm space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-gray-700">
                        • {item.fruitName} - {item.quantityKg}kg
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <span className="font-semibold text-sm">Total: </span>
                  <span className="font-bold text-lg text-green-600">
                    {(order.totalPrice / 1000).toFixed(3)} TND
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => updateStatus(order.id!, "confirmed")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => updateStatus(order.id!, "canceled")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
                  >
                    Decline Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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
