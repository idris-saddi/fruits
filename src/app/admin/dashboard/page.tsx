"use client"

import { useAdminAuth } from "@/features/auth/hooks/use-admin-auth"
import AdminDashboard from "@/features/admin/components/admin-dashboard"

export default function DashboardPage() {
  const { loading, authenticated } = useAdminAuth()

  if (loading || !authenticated) return <p>Chargement...</p>

  return <AdminDashboard />
}
