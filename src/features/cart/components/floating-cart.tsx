"use client"

import { useCartStore } from "@/features/cart/store/cart.store"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/shared/hooks/use-toast"
import { formatPrice } from "@/shared/utils/format"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import CloseIcon from "@mui/icons-material/Close"
import RemoveIcon from "@mui/icons-material/Remove"
import AddIcon from "@mui/icons-material/Add"

export default function FloatingCart() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)
  const increaseBlock = useCartStore((s) => s.increaseBlock)
  const decreaseBlock = useCartStore((s) => s.decreaseBlock)
  const removeItem = useCartStore((s) => s.removeItem)

  const [open, setOpen] = useState(false)
  const { ToastComponent } = useToast()

  const totalItems = items.reduce((sum, item) => sum + item.blocks, 0)

  const router = useRouter()

  const handleClearCart = () => {
    clearCart()
    setOpen(false)
    router.push("/")
  }

  if (items.length === 0) return null

  return (
    <>
      {ToastComponent}

      {/* Floating Bar */}
      {!open && (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-auto z-[1200] pointer-events-none">
          <div className="pointer-events-auto bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white rounded-t-2xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 flex justify-between items-center shadow-2xl backdrop-blur-lg border-2 border-white/20 md:hover:scale-105 transition-all duration-300 w-full md:w-auto md:min-w-[400px]">
            <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-initial">
              <div className="bg-white/20 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                <ShoppingCartIcon />
              </div>
              <div>
                <p className="text-xs md:text-sm text-white/90 font-medium">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </p>
                <p className="text-lg md:text-xl font-bold">
                  {formatPrice(total())} TND
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="bg-white text-rose-600 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold hover:bg-gray-50 active:scale-98 transition-all shadow-lg hover:shadow-xl text-sm md:text-base shrink-0 ml-2 touch-manipulation"
            >
              <span className="hidden sm:inline">View Cart</span>
              <span className="sm:hidden">View</span>
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-end md:items-stretch md:justify-end transition-opacity duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-gradient-to-b from-white to-gray-50 w-full md:w-[450px] max-h-[85vh] md:max-h-screen md:h-screen overflow-y-auto shadow-2xl rounded-t-3xl md:rounded-none transform transition-transform duration-300 ease-out pb-safe md:pb-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              {/* Drawer handle for mobile */}
              <div className="md:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingBagIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
                    Your Cart
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {totalItems} item{totalItems !== 1 ? "s" : ""} selected
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 active:text-gray-700 text-3xl md:text-4xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close cart"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.fruitId}-${item.quantityKg}`}
                    className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base md:text-lg text-gray-800 truncate">
                          {item.fruitName}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          {item.quantityKg}kg × {item.blocks} block
                          {item.blocks !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-lg md:text-xl text-rose-600 whitespace-nowrap">
                          {formatPrice(item.pricePerBlock * item.blocks)} TND
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          decreaseBlock(item.fruitId, item.quantityKg)
                        }
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors"
                      >
                        <RemoveIcon fontSize="small" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.blocks}
                      </span>
                      <button
                        onClick={() =>
                          increaseBlock(item.fruitId, item.quantityKg)
                        }
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors"
                      >
                        <AddIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() =>
                          removeItem(item.fruitId, item.quantityKg)
                        }
                        className="ml-auto text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 md:mt-8 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-5 md:p-6 border-2 border-rose-200 sticky bottom-0 md:static">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <span className="text-gray-600 font-medium text-sm md:text-base">
                    Total Amount
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-rose-600">
                    {formatPrice(total())} TND
                  </span>
                </div>

                <button
                  onClick={() => {
                    setOpen(false)
                    router.push("/checkout")
                  }}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-98 text-white py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all touch-manipulation"
                >
                  Proceed to Checkout
                </button>

                <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 border-2 border-gray-300 px-3 md:px-4 py-2.5 md:py-3 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm md:text-base touch-manipulation"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-3 md:px-4 py-2.5 md:py-3 rounded-xl font-semibold transition-colors text-sm md:text-base touch-manipulation"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
