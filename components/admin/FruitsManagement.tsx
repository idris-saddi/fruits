"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, updateDoc, doc, addDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Fruit } from "@/types/fruit"

export default function FruitsManagement() {
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [newFruitName, setNewFruitName] = useState("")
  const [newFruitUrl, setNewFruitUrl] = useState("")
  const [newQuantities, setNewQuantities] = useState<{quantityKg:number, price:number}[]>([])

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

  const updateQuantities = async (fruit: Fruit, options: {quantityKg:number, price:number}[]) => {
    await updateDoc(doc(db, "fruits", fruit.id), { options })
    setFruits(fruits.map(f => f.id === fruit.id ? { ...f, options } : f))
  }

  const addNewFruit = async () => {
    if (!newFruitName || !newFruitUrl) return
    const docRef = await addDoc(collection(db, "fruits"), {
      name: newFruitName,
      pictureUrl: newFruitUrl,
      isAvailable: true,
      options: newQuantities,
      createdAt: Timestamp.now()
    })
    setFruits([...fruits, { id: docRef.id, name: newFruitName, pictureUrl: newFruitUrl, isAvailable:true, options: newQuantities }])
    setNewFruitName("")
    setNewFruitUrl("")
    setNewQuantities([])
  }

  return (
    <div>
      {/* Add New Fruit */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">Add New Fruit</h2>
        <div className="flex flex-col gap-2">
          <input
            placeholder="Fruit Name"
            value={newFruitName}
            onChange={(e) => setNewFruitName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Image URL"
            value={newFruitUrl}
            onChange={(e) => setNewFruitUrl(e.target.value)}
            className="border p-2 rounded"
          />
          <div className="flex gap-2">
            {newQuantities.map((q, i) => (
              <div key={i} className="flex gap-1 items-center">
                <input
                  type="number"
                  value={q.quantityKg}
                  onChange={e => {
                    const updated = [...newQuantities]
                    updated[i].quantityKg = Number(e.target.value)
                    setNewQuantities(updated)
                  }}
                  className="border p-1 rounded w-16"
                />
                <span>kg</span>
                <input
                  type="number"
                  value={q.price}
                  onChange={e => {
                    const updated = [...newQuantities]
                    updated[i].price = Number(e.target.value)
                    setNewQuantities(updated)
                  }}
                  className="border p-1 rounded w-20"
                />
                <span>millimes</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setNewQuantities([...newQuantities, {quantityKg:1, price:1000}])}
            className="bg-primary text-secondary px-2 py-1 rounded mt-2"
          >
            Add Quantity Option
          </button>
          <button
            onClick={addNewFruit}
            className="bg-primary text-secondary px-4 py-2 rounded mt-2"
          >
            Add Fruit
          </button>
        </div>
      </div>

      {/* Fruits Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-primary text-secondary">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Quantities & Prices</th>
            <th className="p-2">Available</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fruits.map(fruit => (
            <tr key={fruit.id} className="border-b">
              <td className="p-2">{fruit.name}</td>
              <td className="p-2">
                {fruit.options.map(q => `${q.quantityKg}kg → ${(q.price/1000).toFixed(3)} TND`).join(", ")}
              </td>
              <td className="p-2">{fruit.isAvailable ? "Yes" : "No"}</td>
              <td className="p-2 flex gap-2 flex-wrap">
                <button
                  onClick={() => toggleAvailability(fruit)}
                  className="bg-primary text-secondary px-2 py-1 rounded hover:bg-red-900"
                >
                  {fruit.isAvailable ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => {
                    const newPrice = prompt("Enter new quantities as kg:price, comma separated", fruit.options.map(q=>`${q.quantityKg}:${q.price}`).join(","))
                    if(!newPrice) return
                    const updated = newPrice.split(",").map(s=>{
                      const [quantityKg, price] = s.split(":").map(Number)
                      return {quantityKg, price}
                    })
                    updateQuantities(fruit, updated)
                  }}
                  className="bg-primary text-secondary px-2 py-1 rounded hover:bg-red-900"
                >
                  Edit Quantities
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}