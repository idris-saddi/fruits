"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { useRouter } from "next/navigation"

export function useAdminAuth() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login")
      } else {
        // TODO: check isAdmin field in Firestore if needed
      }
      setLoading(false)
    })
    return unsubscribe
  }, [router])

  return { loading }
}