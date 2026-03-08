"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/features/checkout/schemas/checkout.schema"
import { geocodeAddress } from "@/shared/services/geocoding.service"
import { useToast } from "@/shared/hooks/use-toast"

const AddressMap = dynamic(
  () =>
    import("@/features/checkout/components/address-map").then(
      (mod) => mod.AddressMap
    ),
  { ssr: false }
)

interface CheckoutFormProps {
  onSubmit: (
    data: CheckoutFormData,
    location: { lat: number; lng: number }
  ) => Promise<void>
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [location, setLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const { showToast, ToastComponent } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const address = watch("address")

  useEffect(() => {
    if (!address || address.length < 5) {
      setShowMap(false)
      return
    }

    setShowMap(true)

    const timer = setTimeout(() => {
      handleGeocodeAddress(address)
    }, 1000)

    return () => clearTimeout(timer)
  }, [address])

  const handleGeocodeAddress = async (addr: string) => {
    if (!addr || addr.length < 5) return

    setIsGeocoding(true)
    try {
      const result = await geocodeAddress(addr)
      if (result) {
        setLocation({ lat: result.lat, lng: result.lng })
        showToast({
          message: "📍 Location found on map!",
          type: "success",
          duration: 2000,
        })
      } else {
        showToast({
          message: "Could not find location. Please check the address.",
          type: "error",
          duration: 3000,
        })
      }
    } catch {
      showToast({
        message: "Failed to locate address.",
        type: "error",
        duration: 3000,
      })
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleFormSubmit = async (data: CheckoutFormData) => {
    let finalLocation = location
    if (!finalLocation) {
      const result = await geocodeAddress(data.address)
      if (result) {
        finalLocation = { lat: result.lat, lng: result.lng }
      } else {
        showToast({
          message:
            "Could not determine location. Please verify your address.",
          type: "error",
          duration: 3000,
        })
        return
      }
    }

    await onSubmit(data, finalLocation)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      {ToastComponent}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-2xl">📝</span>
        Delivery Information
      </h2>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <input
            placeholder="John Doe"
            {...register("customerName")}
            className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors"
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm mt-1">✗ Name is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            placeholder="john@example.com"
            {...register("email")}
            className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              ✗ Valid email required
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            placeholder="+216 XX XXX XXX"
            {...register("phone")}
            className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              ✗ Phone number required
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Address
          </label>
          <textarea
            placeholder="Street, City, Postal Code"
            {...register("address")}
            rows={3}
            className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors resize-none"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              ✗ Address is required
            </p>
          )}

          {showMap && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                📍 Delivery Location - Click to adjust
              </p>
              {location ? (
                <AddressMap
                  lat={location.lat}
                  lng={location.lng}
                  address={address || ""}
                  onLocationSelect={setLocation}
                />
              ) : (
                <div className="w-full h-[300px] rounded-xl overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📍</div>
                    <p>Locating address...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {isGeocoding && (
            <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
              <span className="animate-spin">⌛</span>
              <span>Finding location on map...</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mt-8"
        >
          {isSubmitting ? "Processing... ⏳" : "Place Order"}
        </button>
      </form>
    </div>
  )
}
