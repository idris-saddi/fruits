"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/shared/lib/firebase"
import { useRouter } from "next/navigation"

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function useAdminAuth() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login")
      } else if (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        await signOut(auth)
        router.push("/admin/login?error=unauthorized")
      } else {
        setAuthenticated(true)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [router])

  return { loading, authenticated }
}
