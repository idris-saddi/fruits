"use client"

import { useEffect, useState } from "react"
import { getAllOrders } from "@/lib/orders.service"
import { Order, OrderStatus } from "@/types/order"
import OrdersMap from "./OrdersMap"
import OrdersTable from "./OrdersTable"
import FruitsManagement from "./FruitsManagement"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

type Tab = "orders" | "fruits"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [activeTab, setActiveTab] = useState<Tab>("orders")

  useEffect(() => {
    async function fetchOrders() {
      const data = await getAllOrders()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter)

  return (
    <div className="p-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-primary text-secondary px-4 py-2 rounded hover:bg-red-900"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "orders" ? "bg-primary text-secondary" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "fruits" ? "bg-primary text-secondary" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("fruits")}
        >
          Fruits Management
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-secondary p-6 rounded-b-xl shadow">
        {activeTab === "orders" && (
          <>
            {/* Filters */}
            <div className="mb-4 flex gap-4 items-center">
              <label>Status Filter:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border p-2 rounded"
              >
                <option value="all">All</option>
                <option value="in_review">In Review</option>
                <option value="confirmed">Confirmed</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            {/* Orders Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Delivery Map</h2>
                <OrdersMap orders={filteredOrders} setOrders={setOrders} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Orders Table</h2>
                <OrdersTable orders={filteredOrders} setOrders={setOrders} />
              </div>
            </div>
          </>
        )}

        {activeTab === "fruits" && <FruitsManagement />}
      </div>
    </div>
  )
}