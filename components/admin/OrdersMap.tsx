"use client"

import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api"
import { Order, OrderStatus } from "@/types/order"
import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Props {
  orders: Order[]
  setOrders: (orders: Order[]) => void
}

const containerStyle = {
  width: "100%",
  height: "400px",
}

// Helper to color markers based on status
const statusColor = (status: OrderStatus) => {
  switch (status) {
    case "in_review": return "yellow"
    case "confirmed": return "blue"
    case "ready": return "orange"
    case "delivered": return "green"
    case "canceled": return "red"
    default: return "gray"
  }
}

export default function OrdersMap({ orders, setOrders }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  })

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (!isLoaded) return <p>Loading map...</p>

  const center = { lat: 36.8, lng: 10.18 }

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status })
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
    setSelectedOrder(null)
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
      {orders.map((o) =>
        o.location?.lat && o.location?.lng ? (
          <Marker
            key={o.id}
            position={{ lat: o.location.lat, lng: o.location.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: statusColor(o.status),
              fillOpacity: 1,
              strokeWeight: 1,
            }}
            onClick={() => setSelectedOrder(o)}
          />
        ) : null
      )}

      {selectedOrder && selectedOrder.location?.lat && selectedOrder.location?.lng && (
        <InfoWindow
          position={{
            lat: selectedOrder.location.lat,
            lng: selectedOrder.location.lng,
          }}
          onCloseClick={() => setSelectedOrder(null)}
        >
          <div className="p-2">
            <h3 className="font-bold">{selectedOrder.customerName}</h3>
            <p>Items: {selectedOrder.items.map(i => i.fruitName).join(", ")}</p>
            <p>Total: {(selectedOrder.totalPrice / 1000).toFixed(3)} TND</p>
            <p>Status: {selectedOrder.status}</p>

            <div className="mt-2 flex flex-wrap gap-1">
              {["in_review","confirmed","ready","delivered","canceled"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selectedOrder.id!, s as OrderStatus)}
                  className="bg-primary text-secondary px-2 py-1 rounded hover:bg-red-900 text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}