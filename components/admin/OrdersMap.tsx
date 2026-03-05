"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { Order, OrderStatus } from "@/types/order"
import { useState, useEffect } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import "leaflet/dist/leaflet.css"

interface Props {
  orders: Order[]
  setOrders: (orders: Order[]) => void
}

// Helper to color markers based on status
const statusColor = (status: OrderStatus) => {
  switch (status) {
    case "in_review": return "#FBBF24"  // yellow
    case "confirmed": return "#3B82F6"  // blue
    case "ready": return "#F97316"      // orange
    case "delivered": return "#22C55E"  // green
    case "canceled": return "#EF4444"   // red
    default: return "#6B7280"           // gray
  }
}

export default function OrdersMap({ orders, setOrders }: Props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const center: [number, number] = [36.8, 10.18]

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status })
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  if (!isClient) return <p>Loading map...</p>

  return (
    <div className="h-[400px] w-full">
      <MapContainer 
        center={center} 
        zoom={7} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {orders.map((o) =>
          o.location?.lat && o.location?.lng ? (
            <CircleMarker
              key={o.id}
              center={[o.location.lat, o.location.lng]}
              radius={10}
              pathOptions={{
                fillColor: statusColor(o.status),
                fillOpacity: 1,
                color: "#000",
                weight: 1,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{o.customerName}</h3>
                  <p>Items: {o.items.map(i => i.fruitName).join(", ")}</p>
                  <p>Total: {(o.totalPrice / 1000).toFixed(3)} TND</p>
                  <p>Status: {o.status}</p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {["in_review","confirmed","ready","delivered","canceled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(o.id!, s as OrderStatus)}
                        className="bg-primary text-secondary px-2 py-1 rounded hover:bg-red-900 text-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ) : null
        )}
      </MapContainer>
    </div>
  )
}