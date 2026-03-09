import { getAvailableFruits } from "@/features/catalog/services/fruits.service"
import FruitCard from "@/features/catalog/components/fruit-card"
import StorefrontIconClient from "./storefront-icon"

export default async function Home() {
  const fruits = await getAvailableFruits()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StorefrontIconClient />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Fruits OK
                </h1>
                <p className="text-rose-100 text-sm">
                  Fresh Seasonal Fruits Delivered
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Video Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            Fresh & Delicious
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md">
            Discover the finest selection of seasonal fruits, delivered fresh to
            your doorstep in Tunisia
          </p>
          <a
            href="#fruits"
            className="mt-8 inline-block bg-rose-500 hover:bg-rose-600 transition-colors text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12" id="fruits">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            Seasonal Selection
          </h3>
          <p className="text-gray-600">
            Handpicked fruits at their peak freshness
          </p>
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
          <div className="text-4xl mb-4"><StorefrontIconClient /></div>
          <p className="text-gray-400">
            © 2026 Fruits OK - Fresh Fruits Delivery in Tunisia
          </p>
        </div>
      </footer>
    </div>
  )
}
