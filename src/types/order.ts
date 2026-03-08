export type OrderStatus =
  | "in_review"
  | "confirmed"
  | "ready"
  | "delivered"
  | "canceled"
  | "returned"

export interface OrderItem {
  fruitId: string
  fruitName: string
  quantityKg: number
  price: number
}

export interface Order {
  id?: string
  customerName: string
  email: string
  phone: string
  address: string
  location: {
    lat: number
    lng: number
  }
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  createdAt?: Date
}
