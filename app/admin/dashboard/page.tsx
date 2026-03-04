"use client"

import { useAdminAuth } from "@/lib/useAdminAuth"
import AdminDashboard from "@/components/admin/AdminDashboard"

export default function DashboardPage() {
  const { loading } = useAdminAuth()

  if (loading) return <p>Loading...</p>

  return <AdminDashboard />
}