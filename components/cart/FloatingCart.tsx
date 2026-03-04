"use client";

import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FloatingCart() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);

  const [open, setOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.blocks, 0);

  const router = useRouter();

  if (items.length === 0) return null;

  return (
    <>
      {/* Floating Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[600px] bg-primary text-secondary rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl z-50">
        <div>
          <p className="text-sm text-secondary">{totalItems} items</p>
          <p className="font-semibold text-secondary">{(total() / 1000).toFixed(3)} TND</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-secondary text-primary px-4 py-2 rounded-xl font-medium hover:bg-gray-200"
        >
          View Cart
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full md:w-[400px] h-full p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Your Cart</h2>

            {items.map((item) => (
              <div key={`${item.fruitId}-${item.quantityKg}`} className="border-b pb-4 mb-4">
                <p className="font-medium">{item.fruitName}</p>
                <p className="text-sm text-gray-500">
                  {item.quantityKg}kg × {item.blocks}
                </p>

                <p className="font-semibold mt-1">{((item.pricePerBlock * item.blocks) / 1000).toFixed(3)} TND</p>
              </div>
            ))}

            <div className="mt-6 border-t pt-4">
              <p className="text-lg font-bold">Total: {(total() / 1000).toFixed(3)} TND</p>

              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/checkout");
                }}
                className="w-full bg-black text-white py-3 rounded-xl mt-4"
              >
                Proceed to Checkout
              </button>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setOpen(false)} className="flex-1 border px-4 py-2 rounded-xl">
                  Close
                </button>

                <button onClick={clearCart} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
