"use client"

import { useEffect, useState } from "react"
import { getAllOrders } from "@/shared/services/orders.service"
import { Order } from "@/types/order"
import OrdersReview from "./orders-review"
import OrdersInProgress from "./orders-in-progress"
import DeliveryMap from "./delivery-map"
import OrdersHistory from "./orders-history"
import FruitsManagement from "./fruits-management"
import { signOut } from "firebase/auth"
import { auth } from "@/shared/lib/firebase"
import { useToast } from "@/shared/hooks/use-toast"

type Tab = "review" | "progress" | "delivery" | "history" | "fruits"

const TABS: { key: Tab; label: string; shortLabel?: string }[] = [
  { key: "review", label: "Orders in Review", shortLabel: "Review" },
  { key: "progress", label: "In Progress", shortLabel: "Progress" },
  { key: "delivery", label: "Delivery Map", shortLabel: "Delivery" },
  { key: "history", label: "History" },
  { key: "fruits", label: "Fruits Management", shortLabel: "Fruits" },
]

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("review")
  const { showToast, ToastComponent } = useToast()

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch(() => {
        showToast({
          message: "Missing or insufficient permissions. Please contact an administrator.",
          type: "error",
        })
      })
  }, [showToast])

  const counts: Record<string, number> = {
    review: orders.filter((o) => o.status === "in_review").length,
    progress: orders.filter((o) => o.status === "confirmed").length,
    delivery: orders.filter((o) => o.status === "ready").length,
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {ToastComponent}
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
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
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-gray-800 text-white border-b-2 border-blue-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.shortLabel ? (
                  <>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </>
                ) : (
                  tab.label
                )}
                {counts[tab.key] > 0 && ` (${counts[tab.key]})`}
              </button>
            ))}
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
