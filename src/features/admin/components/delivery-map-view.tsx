"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { Order, OrderStatus } from "@/types/order"
import { formatPrice } from "@/shared/utils/format"
import "leaflet/dist/leaflet.css"

interface DeliveryMapViewProps {
  visibleOrders: Order[]
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>
  onEditOrder?: (order: Order) => void
}

export function DeliveryMapView({
  visibleOrders,
  onStatusChange,
  onEditOrder,
}: DeliveryMapViewProps) {
  const center: [number, number] = [36.8, 10.18]

  return (
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

      {visibleOrders.map((order) =>
        order.location?.lat && order.location?.lng ? (
          <CircleMarker
            key={order.id}
            center={[order.location.lat, order.location.lng]}
            radius={12}
            pathOptions={{
              fillColor: "#F97316",
              fillOpacity: 0.8,
              color: "#000",
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">
                  {order.customerName}
                </h3>

                <div className="mb-2">
                  <p className="text-sm font-semibold">Téléphone :</p>
                  <p className="text-sm">{order.phone}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-semibold">Adresse :</p>
                  <p className="text-sm">{order.address}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-semibold">Articles :</p>
                  <ul className="text-sm">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.fruitName} - {item.quantityKg}kg
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-semibold">
                    Total: {formatPrice(order.totalPrice)} TND
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    {onEditOrder && (
                      <button
                        onClick={() => onEditOrder(order)}
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex-1 text-sm"
                      >
                        Modifier l'Emplacement
                      </button>
                    )}
                    <button
                      onClick={() =>
                        onStatusChange(order.id!, "delivered")
                      }
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex-1 text-sm"
                    >
                      Livré
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      onStatusChange(order.id!, "returned")
                    }
                    className="bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700 w-full text-sm"
                  >
                    Client Absent (Retour)
                  </button>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ) : null
      )}
    </MapContainer>
  )
}
