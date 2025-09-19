"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Globe,
  Smartphone,
  Monitor,
  Download,
  RefreshCw
} from "lucide-react"
import { useState } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    period: string
    isPositive: boolean
  }
  color: "blue" | "green" | "purple" | "orange" | "red" | "indigo"
  className?: string
}

function MetricCard({ title, value, subtitle, icon, trend, color, className }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600"
  }

  return (
    <Card className={`p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]} flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
}

function ChartCard({ title, description, children, actions }: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4">
        <div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}

export default function DetailedMetrics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(false)

  // Données simulées pour les métriques
  const metrics = {
    users: {
      total: 12847,
      newThisWeek: 342,
      activeDaily: 3456,
      verified: 8932,
      pending: 245
    },
    tontines: {
      total: 1254,
      active: 867,
      completed: 387,
      avgParticipants: 12.4,
      successRate: 94.2
    },
    financial: {
      totalVolume: "2.4M",
      monthlyRevenue: "180K",
      avgTransactionSize: "45K",
      processingFees: "12.5K",
      conversionRate: 3.8
    },
    engagement: {
      dailyActiveUsers: 2145,
      avgSessionDuration: "12m 34s",
      monthlyRetention: 78.5,
      featureAdoption: 65.2
    }
  }

  const platforms = [
    { name: "Mobile", percentage: 72, users: 9250, color: "bg-blue-500" },
    { name: "Desktop", percentage: 28, users: 3597, color: "bg-green-500" }
  ]

  const topRegions = [
    { name: "Cotonou", users: 4521, percentage: 35.2 },
    { name: "Porto-Novo", users: 2843, percentage: 22.1 },
    { name: "Parakou", users: 1987, percentage: 15.5 },
    { name: "Abomey", users: 1245, percentage: 9.7 },
    { name: "Autres", users: 2251, percentage: 17.5 }
  ]

  const recentActivity = [
    { action: "Nouvelle tontine créée", user: "Marie K.", time: "Il y a 5 min", type: "success" },
    { action: "Paiement traité", user: "Adama T.", time: "Il y a 12 min", type: "info" },
    { action: "Vérification d'identité", user: "Fatou S.", time: "Il y a 23 min", type: "warning" },
    { action: "Tontine complétée", user: "Koffi A.", time: "Il y a 1h", type: "success" },
    { action: "Nouveau membre rejoint", user: "Aminata D.", time: "Il y a 2h", type: "info" }
  ]

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simuler le rechargement des données
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Métriques détaillées</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble complète des performances de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("24h")}
            >
              24h
            </Button>
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
            >
              7j
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30d")}
            >
              30j
            </Button>
            <Button
              variant={timeRange === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("90d")}
            >
              90j
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Utilisateurs actifs quotidiens"
          value={metrics.engagement.dailyActiveUsers.toLocaleString()}
          subtitle="Utilisateurs connectés aujourd'hui"
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: 12.5, period: "vs hier", isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="Taux de conversion"
          value={`${metrics.financial.conversionRate}%`}
          subtitle="Visiteurs → Utilisateurs inscrits"
          icon={<Target className="w-5 h-5" />}
          trend={{ value: 2.1, period: "ce mois", isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Rétention mensuelle"
          value={`${metrics.engagement.monthlyRetention}%`}
          subtitle="Utilisateurs qui reviennent"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 5.3, period: "vs mois dernier", isPositive: true }}
          color="purple"
        />
        <MetricCard
          title="Revenus mensuels"
          value={`${metrics.financial.monthlyRevenue} CFA`}
          subtitle="Revenus générés ce mois"
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 18.7, period: "vs mois dernier", isPositive: true }}
          color="orange"
        />
      </div>


      {/* Métriques des tontines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Performance des tontines" description="Indicateurs clés des tontines">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{metrics.tontines.total}</div>
              <div className="text-sm text-gray-500">Tontines créées</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.tontines.active}</div>
              <div className="text-sm text-gray-500">Tontines actives</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.tontines.avgParticipants}</div>
              <div className="text-sm text-gray-500">Participants/tontine</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{metrics.tontines.successRate}%</div>
              <div className="text-sm text-gray-500">Taux de succès</div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Métriques financières" description="Vue d'ensemble des transactions">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Volume total traité</span>
              </div>
              <span className="text-lg font-bold">{metrics.financial.totalVolume} CFA</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Transaction moyenne</span>
              </div>
              <span className="text-lg font-bold">{metrics.financial.avgTransactionSize} CFA</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Frais de traitement</span>
              </div>
              <span className="text-lg font-bold">{metrics.financial.processingFees} CFA</span>
            </div>
          </div>
        </ChartCard>
      </div>


    </div>
  )
}