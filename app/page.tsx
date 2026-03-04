import { getAvailableFruits } from "@/lib/fruits.service"
import FruitCard from "@/components/fruits/FruitCard"

export default async function Home() {
  const fruits = await getAvailableFruits()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍓</div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Fruits OK</h1>
                <p className="text-rose-100 text-sm">Fresh Seasonal Fruits Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Fresh & Delicious 🌟
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the finest selection of seasonal fruits, delivered fresh to your doorstep in Tunisia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12" id="fruits">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Seasonal Selection</h3>
          <p className="text-gray-600">Handpicked fruits at their peak freshness</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {fruits.map((fruit) => (
            <FruitCard key={fruit.id} fruit={fruit} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4">🍊🍋🍇</div>
          <p className="text-gray-400">© 2026 Fruits OK - Fresh Fruits Delivery in Tunisia</p>
        </div>
      </footer>
    </div>
  )
}