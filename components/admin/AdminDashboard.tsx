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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex gap-1 overflow-x-auto">
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "review"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("review")}
            >
              <span className="hidden sm:inline">Orders in Review</span>
              <span className="sm:hidden">Review</span>
              {reviewCount > 0 && ` (${reviewCount})`}
            </button>
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "progress"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">Progress</span>
              {progressCount > 0 && ` (${progressCount})`}
            </button>
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "delivery"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              <span className="hidden sm:inline">Delivery Map</span>
              <span className="sm:hidden">Delivery</span>
              {deliveryCount > 0 && ` (${deliveryCount})`}
            </button>
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "history"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "fruits"
                  ? "bg-gray-800 text-white border-b-2 border-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("fruits")}
            >
              <span className="hidden sm:inline">Fruits Management</span>
              <span className="sm:hidden">Fruits</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white p-3 sm:p-6 rounded shadow">
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