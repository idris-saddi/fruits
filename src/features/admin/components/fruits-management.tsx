"use client"

import { useEffect, useState } from "react"
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/shared/lib/firebase"
import { Fruit } from "@/types/fruit"
import FruitModal from "./fruit-modal"
import { formatPrice } from "@/shared/utils/format"

export default function FruitsManagement() {
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [modalData, setModalData] = useState<{
    mode: "add" | "edit"
    fruit?: Fruit
  } | null>(null)

  useEffect(() => {
    async function fetchFruits() {
      const snapshot = await getDocs(collection(db, "fruits"))
      setFruits(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Fruit)
      )
    }
    fetchFruits()
  }, [])

  const toggleAvailability = async (fruit: Fruit) => {
    await updateDoc(doc(db, "fruits", fruit.id), {
      isAvailable: !fruit.isAvailable,
    })
    setFruits(
      fruits.map((f) =>
        f.id === fruit.id ? { ...f, isAvailable: !f.isAvailable } : f
      )
    )
  }

  const deleteFruit = async (fruit: Fruit) => {
    if (!confirm(`Are you sure you want to delete "${fruit.name}"?`)) return
    await deleteDoc(doc(db, "fruits", fruit.id))
    setFruits(fruits.filter((f) => f.id !== fruit.id))
  }

  const addNewFruit = async (data: {
    name: string
    pictureUrl: string
    options: { quantityKg: number; price: number }[]
  }) => {
    const docRef = await addDoc(collection(db, "fruits"), {
      name: data.name,
      pictureUrl: data.pictureUrl,
      isAvailable: true,
      options: data.options,
      createdAt: Timestamp.now(),
    })
    setFruits([
      ...fruits,
      {
        id: docRef.id,
        name: data.name,
        pictureUrl: data.pictureUrl,
        isAvailable: true,
        options: data.options,
      },
    ])
  }

  const updateFruit = async (
    fruit: Fruit,
    data: {
      name: string
      pictureUrl: string
      options: { quantityKg: number; price: number }[]
    }
  ) => {
    await updateDoc(doc(db, "fruits", fruit.id), {
      name: data.name,
      pictureUrl: data.pictureUrl,
      options: data.options,
    })
    setFruits(fruits.map((f) => (f.id === fruit.id ? { ...f, ...data } : f)))
  }

  const handleModalSave = (data: {
    name: string
    pictureUrl: string
    options: { quantityKg: number; price: number }[]
  }) => {
    if (modalData?.mode === "add") {
      addNewFruit(data)
    } else if (modalData?.mode === "edit" && modalData.fruit) {
      updateFruit(modalData.fruit, data)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Fruits Inventory</h2>
        <button
          onClick={() => setModalData({ mode: "add" })}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add New Fruit
        </button>
      </div>

      {fruits.length === 0 ? (
        <p className="text-gray-500 italic text-center py-8">
          No fruits added yet. Click &ldquo;Add New Fruit&rdquo; to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fruits.map((fruit) => (
            <div
              key={fruit.id}
              className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative">
                <img
                  src={fruit.pictureUrl}
                  alt={fruit.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/300x200?text=No+Image"
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      fruit.isAvailable
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {fruit.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-3">{fruit.name}</h3>

                <div className="mb-4 flex-grow">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Price Options:
                  </p>
                  <div className="space-y-1">
                    {fruit.options.map((option, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded"
                      >
                        {option.quantityKg}kg → {formatPrice(option.price)} TND
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => toggleAvailability(fruit)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      fruit.isAvailable
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {fruit.isAvailable ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => setModalData({ mode: "edit", fruit })}
                    className="flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFruit(fruit)}
                    className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalData && (
        <FruitModal
          mode={modalData.mode}
          fruit={modalData.fruit}
          onClose={() => setModalData(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  )
}
