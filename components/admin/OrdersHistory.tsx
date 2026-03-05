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
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Order History</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Completed, canceled, and returned orders archive.
      </p>

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base">
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
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className={`border rounded-lg p-4 shadow-sm ${
                  order.status === "canceled"
                    ? "border-red-300 bg-red-50"
                    : order.status === "returned"
                    ? "border-orange-300 bg-orange-50"
                    : "border-green-300 bg-green-50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{order.customerName}</h3>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${
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
                </div>

                <div className="text-sm space-y-1 mb-3">
                  <div className="flex items-start">
                    <span className="font-semibold w-16">Phone:</span>
                    <span className="text-gray-700">{order.phone}</span>
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

                <div>
                  <span className="font-semibold text-sm">Total: </span>
                  <span className="font-bold text-lg text-green-600">
                    {(order.totalPrice / 1000).toFixed(3)} TND
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
