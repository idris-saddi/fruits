"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/shared/lib/firebase"
import { useRouter } from "next/navigation"

export function useAdminAuth() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login")
      }
      setLoading(false)
    })
    return unsubscribe
  }, [router])

  return { loading }
}
