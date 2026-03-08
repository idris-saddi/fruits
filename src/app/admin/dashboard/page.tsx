"use client"

import { useAdminAuth } from "@/features/auth/hooks/use-admin-auth"
import AdminDashboard from "@/features/admin/components/admin-dashboard"

export default function DashboardPage() {
  const { loading } = useAdminAuth()

  if (loading) return <p>Loading...</p>

  return <AdminDashboard />
}
