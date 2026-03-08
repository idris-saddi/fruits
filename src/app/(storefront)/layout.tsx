import FloatingCart from "@/features/cart/components/floating-cart"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FloatingCart />
    </>
  )
}
