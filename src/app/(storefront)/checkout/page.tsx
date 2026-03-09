"use client"

import { useCartStore } from "@/features/cart/store/cart.store"
import { createOrder } from "@/shared/services/orders.service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/shared/hooks/use-toast"
import CheckoutForm from "@/features/checkout/components/checkout-form"
import OrderSummary from "@/features/checkout/components/order-summary"
import type { CheckoutFormData } from "@/features/checkout/schemas/checkout.schema"

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const router = useRouter()
  const { showToast, ToastComponent } = useToast()

  useEffect(() => {
    if (items.length === 0 && !isRedirecting) {
      showToast({
        message: "Votre panier est vide !",
        type: "info",
        duration: 2000,
      })
      router.push("/")
    }
  }, [items, router, isRedirecting, showToast])

  const handleSubmit = async (
    data: CheckoutFormData,
    location: { lat: number; lng: number }
  ) => {
    if (items.length === 0) return

    try {
      await createOrder({
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        location,
        items: items.map((item) => ({
          fruitId: item.fruitId,
          fruitName: item.fruitName,
          quantityKg: item.quantityKg,
          price: item.pricePerBlock * item.blocks,
        })),
        totalPrice: total(),
        status: "in_review",
      })

      setIsRedirecting(true)
      clearCart()

      showToast({
        message: "Commande passée avec succès !",
        type: "success",
        duration: 3000,
      })

      router.push("/")
    } catch {
      showToast({
        message: "Échec de la commande. Veuillez réessayer.",
        type: "error",
        duration: 4000,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 py-12">
      {ToastComponent}
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Commande</h1>
          <p className="text-gray-600">
            Finalisez votre commande en quelques étapes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <CheckoutForm onSubmit={handleSubmit} />
          <OrderSummary items={items} total={total()} />
        </div>
      </div>
    </div>
  )
}
