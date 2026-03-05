"use client"

import { Order } from "@/types/order"

interface Props {
  orders: Order[]
}

export default function OrdersHistory({ orders }: Props) {
  const completedOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "canceled" || o.status === "returned"
  )

  const deliveredOrders = completedOrders.filter((o) => o.status === "delivered")
  const canceledOrders = completedOrders.filter((o) => o.status === "canceled")
  const returnedOrders = completedOrders.filter((o) => o.status === "returned")

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <p className="text-gray-600 mb-4">
        Completed, canceled, and returned orders archive.
      </p>

      <div className="mb-6">
        <div className="flex gap-4 mb-2">
          <span className="font-semibold">
            Delivered: {deliveredOrders.length}
          </span>
          <span className="font-semibold">
            Canceled: {canceledOrders.length}
          </span>
          <span className="font-semibold">
            Returned: {returnedOrders.length}
          </span>
        </div>
      </div>

      {completedOrders.length === 0 ? (
        <p className="text-gray-500 italic">No completed orders</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total (TND)</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b hover:bg-gray-50 ${
                    order.status === "canceled"
                      ? "bg-red-50"
                      : order.status === "returned"
                      ? "bg-orange-50"
                      : "bg-green-50"
                  }`}
                >
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">{order.phone}</td>
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
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        order.status === "delivered"
                          ? "bg-green-600"
                          : order.status === "returned"
                          ? "bg-orange-600"
                          : "bg-red-600"
                      }`}
                    >
                      {order.status === "delivered"
                        ? "Delivered"
                        : order.status === "returned"
                        ? "Returned"
                        : "Canceled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
