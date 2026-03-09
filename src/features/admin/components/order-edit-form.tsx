"use client"

import { Order } from "@/types/order"
import { useState } from "react"
import { updateOrderDetails } from "@/shared/services/orders.service"
import dynamic from "next/dynamic"

const AddressMap = dynamic(
  () =>
    import("@/features/checkout/components/address-map").then(
      (mod) => mod.AddressMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
    ),
  }
)

interface OrderEditFormProps {
  order: Order
  onClose: () => void
  onUpdate: (updatedOrder: Order) => void
}

export default function OrderEditForm({
  order,
  onClose,
  onUpdate,
}: OrderEditFormProps) {
  const [formData, setFormData] = useState({
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    address: order.address,
  })
  const [location, setLocation] = useState({
    lat: order.location?.lat || 36.8,
    lng: order.location?.lng || 10.18,
  })

  const handleSave = async () => {
    try {
      const updateData = { ...formData, location }
      await updateOrderDetails(order.id!, updateData)
      onUpdate({ ...order, ...updateData })
      onClose()
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Échec de la mise à jour de la commande")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Modifier les Détails de la Commande</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom du Client
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Lieu de Livraison
            </label>
            <AddressMap
              lat={location.lat}
              lng={location.lng}
              address={formData.address}
              onLocationSelect={setLocation}
            />
            <p className="text-xs text-gray-500 mt-2">
              Coordonnées : {location.lat.toFixed(4)},{" "}
              {location.lng.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
