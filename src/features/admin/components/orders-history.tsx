"use client"

import { useState, useMemo, Fragment } from "react"
import { Order } from "@/types/order"
import { formatPrice } from "@/shared/utils/format"
import SwapVertIcon from "@mui/icons-material/SwapVert"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import LastPageIcon from "@mui/icons-material/LastPage"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"

interface OrdersHistoryProps {
  orders: Order[]
}

const STATUS_CONFIG = {
  delivered: { label: "Livré", bg: "bg-green-600", row: "bg-green-50", border: "border-green-300" },
  canceled: { label: "Annulé", bg: "bg-red-600", row: "bg-red-50", border: "border-red-300" },
  returned: { label: "Retourné", bg: "bg-orange-600", row: "bg-orange-50", border: "border-orange-300" },
} as const

type StatusFilter = "all" | "delivered" | "canceled" | "returned"
type SortField = "date" | "total" | "customer" | "items"
type SortDir = "asc" | "desc"
const PAGE_SIZES = [10, 25, 50]

function formatDate(date?: Date) {
  if (!date) return "—"
  const d = date instanceof Date ? date : new Date((date as unknown as { seconds: number }).seconds * 1000)
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function OrdersHistory({ orders }: OrdersHistoryProps) {
  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "delivered" || o.status === "canceled" || o.status === "returned"),
    [orders]
  )

  // State
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Stats
  const stats = useMemo(() => {
    const delivered = completedOrders.filter((o) => o.status === "delivered")
    const canceled = completedOrders.filter((o) => o.status === "canceled")
    const returned = completedOrders.filter((o) => o.status === "returned")
    const totalRevenue = delivered.reduce((sum, o) => sum + o.totalPrice, 0)
    const avgOrderValue = delivered.length ? totalRevenue / delivered.length : 0
    return {
      total: completedOrders.length,
      delivered: delivered.length,
      canceled: canceled.length,
      returned: returned.length,
      totalRevenue,
      avgOrderValue,
    }
  }, [completedOrders])

  // Filtered + sorted
  const processedOrders = useMemo(() => {
    let result = [...completedOrders]

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.items.some((i) => i.fruitName.toLowerCase().includes(q))
      )
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case "date": {
          const toMs = (d?: Date) => {
            if (!d) return 0
            return d instanceof Date ? d.getTime() : (d as unknown as { seconds: number }).seconds * 1000
          }
          cmp = toMs(a.createdAt) - toMs(b.createdAt)
          break
        }
        case "total":
          cmp = a.totalPrice - b.totalPrice
          break
        case "customer":
          cmp = a.customerName.localeCompare(b.customerName)
          break
        case "items":
          cmp = a.items.length - b.items.length
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [completedOrders, statusFilter, search, sortField, sortDir])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processedOrders.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pagedOrders = processedOrders.slice((safePage - 1) * pageSize, safePage * pageSize)

  // Reset page on filter change
  const handleFilterChange = (fn: () => void) => {
    fn()
    setPage(1)
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return <SwapVertIcon sx={{ fontSize: 14, verticalAlign: "middle" }} />
    return sortDir === "asc" ? <ArrowUpwardIcon sx={{ fontSize: 14, verticalAlign: "middle" }} /> : <ArrowDownwardIcon sx={{ fontSize: 14, verticalAlign: "middle" }} />
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-1">Historique des Commandes</h2>
      <p className="text-sm text-gray-500 mb-4">Commandes livrées, annulées et retournées.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <div className="bg-gray-50 border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.delivered}</div>
          <div className="text-xs text-green-600">Livré</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-700">{stats.canceled}</div>
          <div className="text-xs text-red-600">Annulé</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-700">{stats.returned}</div>
          <div className="text-xs text-orange-600">Retourné</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-700">{formatPrice(stats.totalRevenue)}</div>
          <div className="text-xs text-blue-600">Revenus (TND)</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-700">{formatPrice(stats.avgOrderValue)}</div>
          <div className="text-xs text-purple-600">Moy. Commande (TND)</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Rechercher nom, téléphone, article..."
          value={search}
          onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-0"
        />
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(() => setStatusFilter(e.target.value as StatusFilter))}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Tous les Statuts</option>
          <option value="delivered">Livré</option>
          <option value="canceled">Annulé</option>
          <option value="returned">Retourné</option>
        </select>
        <select
          value={pageSize}
          onChange={(e) => handleFilterChange(() => setPageSize(Number(e.target.value)))}
          className="border rounded-lg px-3 py-2 text-sm bg-white w-20"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500 mb-2">
        {processedOrders.length} commande{processedOrders.length !== 1 ? "s" : ""} trouvée{processedOrders.length !== 1 ? "s" : ""}
      </div>

      {processedOrders.length === 0 ? (
        <p className="text-gray-500 italic py-8 text-center">Aucune commande ne correspond à vos filtres</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2.5 text-left w-8"></th>
                  <th
                    className="p-2.5 text-left cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => toggleSort("customer")}
                  >
                    Client {sortIcon("customer")}
                  </th>
                  <th
                    className="p-2.5 text-left cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => toggleSort("items")}
                  >
                    Articles {sortIcon("items")}
                  </th>
                  <th
                    className="p-2.5 text-left cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => toggleSort("total")}
                  >
                    Total {sortIcon("total")}
                  </th>
                  <th className="p-2.5 text-left">Statut</th>
                  <th
                    className="p-2.5 text-left cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => toggleSort("date")}
                  >
                    Date {sortIcon("date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => {
                  const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                  const isExpanded = expandedId === order.id
                  return (
                    <Fragment key={order.id}>
                      <tr
                        className={`border-b cursor-pointer hover:bg-gray-100 transition-colors ${config?.row ?? ""}`}
                        onClick={() => setExpandedId(isExpanded ? null : order.id ?? null)}
                      >
                        <td className="p-2.5 text-gray-400 text-xs w-8">{isExpanded ? <ExpandMoreIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />}</td>
                        <td className="p-2.5 font-medium">{order.customerName}</td>
                        <td className="p-2.5 text-gray-600">{order.items.length}</td>
                        <td className="p-2.5 font-semibold">{formatPrice(order.totalPrice)}</td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-white text-xs ${config?.bg ?? "bg-gray-600"}`}>
                            {config?.label ?? order.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b">
                          <td colSpan={6} className="bg-gray-50 px-8 py-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500 text-xs block">Téléphone</span>
                                  <span className="font-medium">{order.phone}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs block">Email</span>
                                  <span className="font-medium">{order.email}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-gray-500 text-xs block">Adresse</span>
                                  <span className="font-medium">{order.address}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Articles</span>
                                <div className="flex flex-wrap gap-2">
                                  {order.items.map((item, idx) => (
                                    <span key={idx} className="bg-white border rounded px-2 py-1 text-xs">
                                      {item.fruitName} — {item.quantityKg}kg × {formatPrice(item.price)} TND
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {pagedOrders.map((order) => {
              const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
              const isExpanded = expandedId === order.id
              return (
                <div
                  key={order.id}
                  className={`border rounded-lg overflow-hidden ${config?.border ?? ""} ${config?.row ?? ""}`}
                >
                  {/* Collapsed summary */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : order.id ?? null)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isExpanded ? <ExpandMoreIcon sx={{ fontSize: 16, color: "#9ca3af" }} /> : <ChevronRightIcon sx={{ fontSize: 16, color: "#9ca3af" }} />}
                      <span className="font-medium truncate">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-sm">{formatPrice(order.totalPrice)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-white text-xs ${config?.bg ?? "bg-gray-600"}`}>
                        {config?.label ?? order.status}
                      </span>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t px-3 py-3 space-y-2 text-sm bg-white/60">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-500 text-xs block">Téléphone</span>
                          <span>{order.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">Email</span>
                          <span className="break-all">{order.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">Date</span>
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Adresse</span>
                        <span>{order.address}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block mb-1">Articles</span>
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-gray-700">
                              • {item.fruitName} — {item.quantityKg}kg × {formatPrice(item.price)} TND
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-500">
                Page {safePage} sur {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={safePage === 1}
                  className="px-2 py-1 border rounded disabled:opacity-30 hover:bg-gray-100"
                >
                  <FirstPageIcon sx={{ fontSize: 18 }} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-2 py-1 border rounded disabled:opacity-30 hover:bg-gray-100"
                >
                  <NavigateBeforeIcon sx={{ fontSize: 18 }} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (safePage <= 3) {
                    pageNum = i + 1
                  } else if (safePage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = safePage - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-2.5 py-1 border rounded ${safePage === pageNum ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="px-2 py-1 border rounded disabled:opacity-30 hover:bg-gray-100"
                >
                  <NavigateNextIcon sx={{ fontSize: 18 }} />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={safePage === totalPages}
                  className="px-2 py-1 border rounded disabled:opacity-30 hover:bg-gray-100"
                >
                  <LastPageIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
