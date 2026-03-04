"use client";

import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function FloatingCart() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);

  const [open, setOpen] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const totalItems = items.reduce((sum, item) => sum + item.blocks, 0);

  const router = useRouter();

  const handleClearCart = () => {
    clearCart();
    setOpen(false);
    router.push("/");
  };

  if (items.length === 0) return null;

  return (
    <>
      {ToastComponent}
      {/* Floating Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[600px] bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white rounded-2xl px-6 py-5 flex justify-between items-center shadow-2xl z-50 backdrop-blur-lg border-2 border-white/20 hover:scale-105 transition-transform">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
            🛒
          </div>
          <div>
            <p className="text-sm text-white/90 font-medium">{totalItems} items</p>
            <p className="text-xl font-bold">{(total() / 1000).toFixed(3)} TND</p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-rose-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
        >
          View Cart 🎉
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" onClick={() => setOpen(false)}>
          <div className="bg-gradient-to-b from-white to-gray-50 w-full md:w-[450px] h-full p-8 overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-3xl">🛍️</span>
                  Your Cart
                </h2>
                <p className="text-gray-500 text-sm mt-1">{totalItems} items selected</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-3xl">
                ×
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.fruitId}-${item.quantityKg}`} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-800">{item.fruitName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.quantityKg}kg × {item.blocks} blocks
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-rose-600">{((item.pricePerBlock * item.blocks) / 1000).toFixed(3)} TND</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 border-2 border-rose-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-3xl font-bold text-rose-600">{(total() / 1000).toFixed(3)} TND</span>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/checkout");
                }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Proceed to Checkout 🚀
              </button>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setOpen(false)} className="flex-1 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Continue Shopping
                </button>
                <button onClick={handleClearCart} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors">
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
