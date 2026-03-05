"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Fruit } from "@/types/fruit"
import FruitModal from "./FruitModal"

// Icon Components
const VisibilityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const VisibilityOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

export default function FruitsManagement() {
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [modalData, setModalData] = useState<{ mode: "add" | "edit"; fruit?: Fruit } | null>(null)

  useEffect(() => {
    async function fetchFruits() {
      const snapshot = await getDocs(collection(db, "fruits"))
      setFruits(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Fruit)))
    }
    fetchFruits()
  }, [])

  const toggleAvailability = async (fruit: Fruit) => {
    await updateDoc(doc(db, "fruits", fruit.id), { isAvailable: !fruit.isAvailable })
    setFruits(fruits.map(f => f.id === fruit.id ? { ...f, isAvailable: !f.isAvailable } : f))
  }

  const deleteFruit = async (fruit: Fruit) => {
    if (!confirm(`Are you sure you want to delete "${fruit.name}"?`)) return
    await deleteDoc(doc(db, "fruits", fruit.id))
    setFruits(fruits.filter(f => f.id !== fruit.id))
  }

  const addNewFruit = async (data: { name: string; pictureUrl: string; options: {quantityKg:number, price:number}[] }) => {
    const docRef = await addDoc(collection(db, "fruits"), {
      name: data.name,
      pictureUrl: data.pictureUrl,
      isAvailable: true,
      options: data.options,
      createdAt: Timestamp.now()
    })
    setFruits([...fruits, { 
      id: docRef.id, 
      name: data.name, 
      pictureUrl: data.pictureUrl, 
      isAvailable: true, 
      options: data.options 
    }])
  }

  const updateFruit = async (fruit: Fruit, data: { name: string; pictureUrl: string; options: {quantityKg:number, price:number}[] }) => {
    await updateDoc(doc(db, "fruits", fruit.id), { 
      name: data.name,
      pictureUrl: data.pictureUrl,
      options: data.options 
    })
    setFruits(fruits.map(f => f.id === fruit.id ? { ...f, ...data } : f))
  }

  const handleModalSave = (data: { name: string; pictureUrl: string; options: {quantityKg:number, price:number}[] }) => {
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

      {/* Fruits Grid */}
      {fruits.length === 0 ? (
        <p className="text-gray-500 italic text-center py-8">No fruits added yet. Click "Add New Fruit" to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fruits.map(fruit => (
            <div key={fruit.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Image */}
              <div className="relative">
                <img
                  src={fruit.pictureUrl}
                  alt={fruit.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image"
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

              {/* Content */}
              <div className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-3">{fruit.name}</h3>
                
                <div className="mb-4 flex-grow">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Price Options:</p>
                  <div className="space-y-1">
                    {fruit.options.map((option, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                        {option.quantityKg}kg → {(option.price / 1000).toFixed(3)} TND
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions at Bottom */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => toggleAvailability(fruit)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      fruit.isAvailable
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    title={fruit.isAvailable ? "Disable" : "Enable"}
                  >
                    {fruit.isAvailable ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    <span>{fruit.isAvailable ? "Disable" : "Enable"}</span>
                  </button>
                  <button
                    onClick={() => setModalData({ mode: "edit", fruit })}
                    className="flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    title="Edit fruit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => deleteFruit(fruit)}
                    className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                    title="Delete fruit"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fruit Modal */}
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