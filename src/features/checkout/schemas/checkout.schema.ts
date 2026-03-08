import { z } from "zod"

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
