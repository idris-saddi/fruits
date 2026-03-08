"use client"

import { Fruit } from "@/types/fruit"
import { useCartStore } from "@/features/cart/store/cart.store"
import { useState } from "react"
import { formatPrice } from "@/shared/utils/format"

interface FruitCardProps {
  fruit: Fruit
}

export default function FruitCard({ fruit }: FruitCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAdd = (quantity: number, price: number) => {
    addItem({
      fruitId: fruit.id,
      fruitName: fruit.name,
      quantityKg: quantity,
      pricePerBlock: price,
    })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
        <img
          src={fruit.pictureUrl}
          alt={fruit.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          {fruit.name}
        </h2>

        <div className="space-y-3">
          {fruit.options
            .sort((a, b) => a.quantityKg - b.quantityKg)
            .map((option) => (
              <button
                key={option.quantityKg}
                onClick={() => handleAdd(option.quantityKg, option.price)}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex justify-between items-center"
              >
                <span className="text-lg">{option.quantityKg}kg</span>
                <span className="text-lg font-bold">
                  {formatPrice(option.price)} TND
                </span>
              </button>
            ))}
        </div>
      </div>

      {showSuccess && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span className="text-xl">✓</span>
          <span className="font-medium">Added!</span>
        </div>
      )}
    </div>
  )
}
