"use client"

import dynamic from "next/dynamic"

const StorefrontIcon = dynamic(
  () => import("@mui/icons-material/Storefront"),
  { ssr: false }
)

export default function StorefrontIconClient() {
  return <StorefrontIcon style={{ fontSize: 40 }} />
}
