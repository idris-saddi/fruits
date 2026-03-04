"use client";

import { useCartStore } from "@/store/cart.store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrder } from "@/lib/orders.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";

const schema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (items.length === 0 && !isRedirecting) {
      showToast({
        message: "Your cart is empty!",
        type: "info",
        duration: 2000,
      });
      router.push("/");
    }
  }, [items, router, isRedirecting, showToast]);

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;

    try {
      await createOrder({
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        location: {
          lat: 0,
          lng: 0,
        }, // temporary
        items: items.map((item) => ({
          fruitId: item.fruitId,
          fruitName: item.fruitName,
          quantityKg: item.quantityKg,
          price: item.pricePerBlock * item.blocks,
        })),
        totalPrice: total(),
        status: "in_review",
      });

      setIsRedirecting(true);
      clearCart();
      
      showToast({
        message: "Order placed successfully! 🎉",
        type: "success",
        duration: 3000,
      });

      router.push("/");
    } catch (error) {
      showToast({
        message: "Failed to place order. Please try again.",
        type: "error",
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 py-12">
      {ToastComponent}
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input 
                  placeholder="John Doe" 
                  {...register("customerName")} 
                  className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors" 
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">✗ Name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  placeholder="john@example.com" 
                  {...register("email")} 
                  className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors" 
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">✗ Valid email required</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input 
                  placeholder="+216 XX XXX XXX" 
                  {...register("phone")} 
                  className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors" 
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">✗ Phone number required</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                <textarea 
                  placeholder="Street, City, Postal Code" 
                  {...register("address")} 
                  rows={3}
                  className="w-full border-2 border-gray-200 focus:border-rose-500 p-4 rounded-xl outline-none transition-colors resize-none" 
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">✗ Address is required</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mt-8"
              >
                {isSubmitting ? "Processing... ⏳" : "Place Order 🚀"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-fit sticky top-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📦</span>
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.fruitId}-${item.quantityKg}`} className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800">{item.fruitName}</p>
                    <p className="text-sm text-gray-500">{item.quantityKg}kg × {item.blocks}</p>
                  </div>
                  <p className="font-bold text-rose-600">{((item.pricePerBlock * item.blocks) / 1000).toFixed(3)} TND</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 border-2 border-rose-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                <span className="text-3xl font-bold text-rose-600">{(total() / 1000).toFixed(3)} TND</span>
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
                <span>Payment on delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
