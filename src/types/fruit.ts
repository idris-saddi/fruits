export interface FruitOption {
  quantityKg: number
  price: number // in millimes
}

export interface Fruit {
  id: string
  name: string
  options: FruitOption[]
  pictureUrl: string
  isAvailable: boolean
  createdAt?: Date
}
