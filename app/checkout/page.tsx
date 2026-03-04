"use client";

import { useCartStore } from "@/store/cart.store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrder } from "@/lib/orders.service";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;

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

    clearCart();
    router.push("/");
    alert("Order submitted successfully!");
  };

  if (items.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input placeholder="Full Name" {...register("customerName")} className="w-full border p-3 rounded-lg" />
        {errors.customerName && <p className="text-red-500 text-sm">Name is required</p>}

        <input placeholder="Email" {...register("email")} className="w-full border p-3 rounded-lg" />
        {errors.email && <p className="text-red-500 text-sm">Valid email required</p>}

        <input placeholder="Phone" {...register("phone")} className="w-full border p-3 rounded-lg" />

        <input placeholder="Delivery Address" {...register("address")} className="w-full border p-3 rounded-lg" />

        <div className="border-t pt-4">
          <p className="text-lg font-semibold">Total: {(total() / 1000).toFixed(3)} TND</p>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-3 rounded-xl">
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
