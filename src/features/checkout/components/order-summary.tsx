"use client"

import { formatPrice } from "@/shared/utils/format"

interface CartItem {
  fruitId: string
  fruitName: string
  quantityKg: number
  pricePerBlock: number
  blocks: number
}

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-fit sticky top-8 mb-24 lg:mb-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-2xl">📦</span>
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={`${item.fruitId}-${item.quantityKg}`}
            className="flex justify-between items-center pb-4 border-b border-gray-100"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.fruitName}</p>
              <p className="text-sm text-gray-500">
                {item.quantityKg}kg × {item.blocks}
              </p>
            </div>
            <p className="font-bold text-rose-600">
              {formatPrice(item.pricePerBlock * item.blocks)} TND
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 border-2 border-rose-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">
            Total Amount
          </span>
          <span className="text-3xl font-bold text-rose-600">
            {formatPrice(total)} TND
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Free delivery on orders over 100 TND</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Fresh fruits guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>24h delivery in Tunis area</span>
        </div>
      </div>
    </div>
  )
}
