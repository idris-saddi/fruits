"use client"

import { Order, OrderStatus } from "@/types/order"
import { updateOrderStatus } from "@/shared/services/orders.service"
import { useState } from "react"
import dynamic from "next/dynamic"
import OrderEditForm from "./order-edit-form"
import { formatPrice } from "@/shared/utils/format"

const DeliveryMapView = dynamic(
  () =>
    import("./delivery-map-view").then((mod) => mod.DeliveryMapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded animate-pulse flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    ),
  }
)

interface DeliveryMapProps {
  orders: Order[]
  setOrders: (orders: Order[]) => void
}

export default function DeliveryMap({ orders, setOrders }: DeliveryMapProps) {
  const [hiddenOrders, setHiddenOrders] = useState<Set<string>>(new Set())
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const readyOrders = orders.filter((o) => o.status === "ready")
  const visibleOrders = readyOrders.filter((o) => !hiddenOrders.has(o.id!))

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status)
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
  }

  const toggleOrderVisibility = (orderId: string) => {
    const newHidden = new Set(hiddenOrders)
    if (newHidden.has(orderId)) {
      newHidden.delete(orderId)
    } else {
      newHidden.add(orderId)
    }
    setHiddenOrders(newHidden)
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
        Delivery Map
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Orders ready for delivery. Mark as delivered when completed.
      </p>

      {readyOrders.length === 0 ? (
        <p className="text-gray-500 italic mb-4">
          No orders ready for delivery
        </p>
      ) : (
        <p className="mb-3 sm:mb-4 font-semibold text-sm sm:text-base">
          {readyOrders.length} order(s) ready for delivery
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Orders List */}
        <div className="w-full md:w-80 border border-gray-300 rounded overflow-hidden">
          <div className="bg-gray-800 text-white p-3 font-semibold">
            Delivery Orders
          </div>
          <div className="max-h-[300px] md:max-h-[500px] overflow-y-auto">
            {readyOrders.length === 0 ? (
              <p className="p-4 text-gray-500 italic text-sm">No orders</p>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className={`border-b p-3 hover:bg-gray-50 ${
                    hiddenOrders.has(order.id!) ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">{order.customerName}</div>
                    <button
                      onClick={() => toggleOrderVisibility(order.id!)}
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        hiddenOrders.has(order.id!)
                          ? "bg-gray-300 text-gray-700"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {hiddenOrders.has(order.id!) ? "Show" : "Hide"}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <div>{order.phone}</div>
                    <div className="line-clamp-1">{order.address}</div>
                  </div>
                  <div className="text-sm mb-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-gray-700">
                        {item.fruitName} - {item.quantityKg}kg
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="font-semibold text-sm">
                      {formatPrice(order.totalPrice)} TND
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order.id!, "delivered")
                        }
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order.id!, "returned")
                        }
                        className="bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700"
                      >
                        Returned
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className="w-full md:flex-1 h-[600px] md:h-[500px] border-2 border-blue-500 rounded bg-gray-100 relative">
          <DeliveryMapView
            visibleOrders={visibleOrders}
            onStatusChange={handleStatusChange}
            onEditOrder={setEditingOrder}
          />
        </div>
      </div>

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
