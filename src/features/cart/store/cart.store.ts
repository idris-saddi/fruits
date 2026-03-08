import { create } from "zustand"

interface CartItem {
  fruitId: string
  fruitName: string
  quantityKg: number
  pricePerBlock: number
  blocks: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "blocks">) => void
  removeItem: (fruitId: string, quantityKg: number) => void
  increaseBlock: (fruitId: string, quantityKg: number) => void
  decreaseBlock: (fruitId: string, quantityKg: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.fruitId === item.fruitId && i.quantityKg === item.quantityKg
      )

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.fruitId === item.fruitId && i.quantityKg === item.quantityKg
              ? { ...i, blocks: i.blocks + 1 }
              : i
          ),
        }
      }

      return {
        items: [...state.items, { ...item, blocks: 1 }],
      }
    }),

  removeItem: (fruitId, quantityKg) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.fruitId === fruitId && i.quantityKg === quantityKg)
      ),
    })),

  increaseBlock: (fruitId, quantityKg) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.fruitId === fruitId && i.quantityKg === quantityKg
          ? { ...i, blocks: i.blocks + 1 }
          : i
      ),
    })),

  decreaseBlock: (fruitId, quantityKg) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.fruitId === fruitId && i.quantityKg === quantityKg
            ? { ...i, blocks: i.blocks - 1 }
            : i
        )
        .filter((i) => i.blocks > 0),
    })),

  clearCart: () => set({ items: [] }),

  total: () =>
    get().items.reduce((sum, item) => sum + item.pricePerBlock * item.blocks, 0),
}))
