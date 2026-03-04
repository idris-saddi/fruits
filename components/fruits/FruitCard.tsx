"use client";

import { Fruit } from "@/types/fruit";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";

interface Props {
  fruit: Fruit;
}

export default function FruitCard({ fruit }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (quantity: number, price: number) => {
    addItem({
      fruitId: fruit.id,
      fruitName: fruit.name,
      quantityKg: quantity,
      pricePerBlock: price,
    });
  };

  return (
    <div className="border rounded-xl p-4 shadow-md bg-secondary text-foreground">
      <img src={fruit.pictureUrl} alt={fruit.name} className="w-full h-48 object-cover rounded-lg" />

      <h2 className="text-xl font-semibold mt-2 text-foreground">{fruit.name}</h2>

      <div className="flex flex-col gap-2 mt-4">
        {fruit.options.map((option) => (
          <button
            key={option.quantityKg}
            onClick={() => handleAdd(option.quantityKg, option.price)}
            className="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-red-900"
          >
            {option.quantityKg}kg – {(option.price / 1000).toFixed(3)} TND
          </button>
        ))}
      </div>
    </div>
  );
}
