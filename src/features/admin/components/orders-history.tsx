"use client"

import { Order } from "@/types/order"
import { formatPrice } from "@/shared/utils/format"

interface OrdersHistoryProps {
  orders: Order[]
}

const STATUS_CONFIG = {
  delivered: { label: "Delivered", bg: "bg-green-600", row: "bg-green-50", border: "border-green-300" },
  canceled: { label: "Canceled", bg: "bg-red-600", row: "bg-red-50", border: "border-red-300" },
  returned: { label: "Returned", bg: "bg-orange-600", row: "bg-orange-50", border: "border-orange-300" },
} as const

export default function OrdersHistory({ orders }: OrdersHistoryProps) {
  const completedOrders = orders.filter(
    (o) =>
      o.status === "delivered" ||
      o.status === "canceled" ||
      o.status === "returned"
  )

  const deliveredCount = completedOrders.filter((o) => o.status === "delivered").length
  const canceledCount = completedOrders.filter((o) => o.status === "canceled").length
  const returnedCount = completedOrders.filter((o) => o.status === "returned").length

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
        Order History
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Completed, canceled, and returned orders archive.
      </p>

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base">
          <span className="font-semibold">Delivered: {deliveredCount}</span>
          <span className="font-semibold">Canceled: {canceledCount}</span>
          <span className="font-semibold">Returned: {returnedCount}</span>
        </div>
      </div>

      {completedOrders.length === 0 ? (
        <p className="text-gray-500 italic">No completed orders</p>
      ) : (
        <>
          {/* Desktop Table */}
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
                {completedOrders.map((order) => {
                  const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                  return (
                    <tr
                      key={order.id}
                      className={`border-b hover:bg-gray-50 ${config?.row ?? ""}`}
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
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${config?.bg ?? "bg-gray-600"}`}
                        >
                          {config?.label ?? order.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {completedOrders.map((order) => {
              const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
              return (
                <div
                  key={order.id}
                  className={`border rounded-lg p-4 shadow-sm ${config?.border ?? ""} ${config?.row ?? ""}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">
                      {order.customerName}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${config?.bg ?? "bg-gray-600"}`}
                    >
                      {config?.label ?? order.status}
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
                      {formatPrice(order.totalPrice)} TND
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
