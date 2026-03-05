"use client"

import { useEffect, useState } from "react"
import { getAllOrders } from "@/lib/orders.service"
import { Order } from "@/types/order"
import OrdersReview from "./OrdersReview"
import OrdersInProgress from "./OrdersInProgress"
import DeliveryMap from "./DeliveryMap"
import OrdersHistory from "./OrdersHistory"
import FruitsManagement from "./FruitsManagement"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

type Tab = "review" | "progress" | "delivery" | "history" | "fruits"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("review")

  useEffect(() => {
    async function fetchOrders() {
      const data = await getAllOrders()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  const reviewCount = orders.filter((o) => o.status === "in_review").length
  const progressCount = orders.filter((o) => o.status === "confirmed").length
  const deliveryCount = orders.filter((o) => o.status === "ready").length

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "review"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("review")}
            >
              Orders in Review {reviewCount > 0 && `(${reviewCount})`}
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "progress"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              In Progress {progressCount > 0 && `(${progressCount})`}
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "delivery"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              Delivery Map {deliveryCount > 0 && `(${deliveryCount})`}
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "history"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "fruits"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("fruits")}
            >
              Fruits Management
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded shadow">
          {activeTab === "review" && (
            <OrdersReview orders={orders} setOrders={setOrders} />
          )}
          {activeTab === "progress" && (
            <OrdersInProgress orders={orders} setOrders={setOrders} />
          )}
          {activeTab === "delivery" && (
            <DeliveryMap orders={orders} setOrders={setOrders} />
          )}
          {activeTab === "history" && <OrdersHistory orders={orders} />}
          {activeTab === "fruits" && <FruitsManagement />}
        </div>
      </div>
    </div>
  )
}