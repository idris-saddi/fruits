"use client"

import { Fruit } from "@/types/fruit"
import { useState } from "react"

interface Props {
  fruit?: Fruit // Optional for add mode
  onClose: () => void
  onSave: (data: { name: string; pictureUrl: string; options: { quantityKg: number; price: number }[] }) => void
  mode: "add" | "edit"
}

export default function FruitModal({ fruit, onClose, onSave, mode }: Props) {
  const [name, setName] = useState(fruit?.name || "")
  const [pictureUrl, setPictureUrl] = useState(fruit?.pictureUrl || "")
  const [options, setOptions] = useState<{ quantityKg: number; price: number }[]>(
    fruit?.options && fruit.options.length > 0 ? fruit.options : [{ quantityKg: 1, price: 1000 }]
  )

  const addOption = () => {
    setOptions([...options, { quantityKg: 1, price: 1000 }])
  }

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, field: "quantityKg" | "price", value: number) => {
    const updated = [...options]
    updated[index][field] = value
    setOptions(updated)
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a fruit name")
      return
    }
    if (!pictureUrl.trim()) {
      alert("Please enter an image URL")
      return
    }
    if (options.some((o) => o.quantityKg <= 0 || o.price <= 0)) {
      alert("All quantities and prices must be greater than 0")
      return
    }
    onSave({ name, pictureUrl, options })
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {mode === "add" ? "Add New Fruit" : `Edit ${fruit?.name || "Fruit"}`}
        </h3>

        {/* Name and Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fruit Name *</label>
            <input
              placeholder="e.g., Orange, Apple, Banana"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL *</label>
            <input
              placeholder="https://..."
              value={pictureUrl}
              onChange={(e) => setPictureUrl(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        {/* Image Preview */}
        {pictureUrl && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Image Preview:</p>
            <img
              src={pictureUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border border-gray-300"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        )}

        {/* Price Options */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Price Options *</label>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={option.quantityKg}
                    onChange={(e) => updateOption(index, "quantityKg", Number(e.target.value))}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Price (TND)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={(option.price / 1000).toFixed(3)}
                    onChange={(e) => updateOption(index, "price", Math.round(Number(e.target.value) * 1000))}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <button
                  onClick={() => removeOption(index)}
                  disabled={options.length === 1}
                  className="mt-5 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  title="Remove option"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className="w-full mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Add Another Option
          </button>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {mode === "add" ? "Add Fruit" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
