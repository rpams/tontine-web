"use client"

import DetailedMetrics from "@/components/admin/DetailedMetrics"
import AdvancedCharts from "@/components/admin/AdvancedCharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  ArrowLeft,
  Download,
  RefreshCw,
  Calendar,
  Activity
} from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function AdminMetricsPage() {
  return (
    <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* Navigation et breadcrumb */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-1 bg-white border rounded-lg p-1">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour Admin
                </Button>
              </Link>
              <Button variant="default" size="sm" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Données en temps réel
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                <Activity className="w-3 h-3 mr-1" />
                Mise à jour auto
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Administration</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics & Métriques</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Section Métriques détaillées */}
        <div className="space-y-6 mb-8">
          <DetailedMetrics />
        </div>

        {/* Section Graphiques avancés */}
        <div className="space-y-6">
          <AdvancedCharts />
        </div>
      </main>
    </div>
  )
}