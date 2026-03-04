import { getAvailableFruits } from "@/lib/fruits.service"
import FruitCard from "@/components/fruits/FruitCard"

export default async function Home() {
  const fruits = await getAvailableFruits()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">
        Seasonal Fruits
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {fruits.map((fruit) => (
          <FruitCard key={fruit.id} fruit={fruit} />
        ))}
      </div>
    </main>
  )
}