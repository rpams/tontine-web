"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react"
import { useState } from "react"

interface ChartWrapperProps {
  title: string
  subtitle?: string
  value?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  children: React.ReactNode
  actions?: React.ReactNode
}

function ChartWrapper({ title, subtitle, value, trend, children, actions }: ChartWrapperProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
          {value && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{value}</span>
              {trend && (
                <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs h-5">
                  {trend.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Badge>
              )}
            </div>
          )}
        </div>
        {actions}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}

// Composant de graphique en aires pour les revenus
function RevenueAreaChart() {
  const data = [
    { month: "Jan", revenue: 12000, users: 850 },
    { month: "Fév", revenue: 15000, users: 1020 },
    { month: "Mar", revenue: 18000, users: 1250 },
    { month: "Avr", revenue: 22000, users: 1480 },
    { month: "Mai", revenue: 28000, users: 1750 },
    { month: "Jun", revenue: 35000, users: 2100 },
    { month: "Jul", revenue: 42000, users: 2450 }
  ]

  const maxRevenue = Math.max(...data.map(d => d.revenue))

  return (
    <div className="space-y-4">
      <div className="h-64 relative">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const height = (item.revenue / maxRevenue) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity relative group">
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: `${height * 2}px` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.revenue.toLocaleString()} CFA
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-blue-600">42K CFA</div>
          <div className="text-xs text-gray-500">Juillet</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">+23%</div>
          <div className="text-xs text-gray-500">Croissance</div>
        </div>
        <div>
          <div className="text-lg font-bold text-purple-600">2.45K</div>
          <div className="text-xs text-gray-500">Nouveaux users</div>
        </div>
      </div>
    </div>
  )
}

// Composant de graphique en barres pour les transactions
function TransactionBarChart() {
  const data = [
    { day: "Lun", transactions: 145, amount: 1250000 },
    { day: "Mar", transactions: 189, amount: 1680000 },
    { day: "Mer", transactions: 234, amount: 2100000 },
    { day: "Jeu", transactions: 198, amount: 1890000 },
    { day: "Ven", transactions: 267, amount: 2450000 },
    { day: "Sam", transactions: 156, amount: 1340000 },
    { day: "Dim", transactions: 123, amount: 1120000 }
  ]

  const maxTransactions = Math.max(...data.map(d => d.transactions))

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-end justify-between gap-3">
        {data.map((item, index) => {
          const height = (item.transactions / maxTransactions) * 100
          const isWeekend = item.day === "Sam" || item.day === "Dim"

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center group">
                <div
                  className={`w-full rounded-t transition-all duration-300 hover:scale-105 ${
                    isWeekend ? 'bg-gray-400' : 'bg-green-500'
                  }`}
                  style={{ height: `${height * 1.5}px` }}
                />
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -translate-y-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.transactions} transactions
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{item.day}</span>
            </div>
          )
        })}
      </div>

      <div className="border-t pt-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">Moyenne par jour</div>
            <div className="text-lg font-bold">187</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">Volume total</div>
            <div className="text-lg font-bold">11.83M CFA</div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function AdvancedCharts() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper
          title="Évolution des revenus"
          subtitle="Croissance mensuelle des revenus"
          value="42,000 CFA"
          trend={{ value: 23.4, isPositive: true }}
          actions={
            <Button variant="outline" size="sm">
              <LineChart className="w-4 h-4" />
            </Button>
          }
        >
          <RevenueAreaChart />
        </ChartWrapper>

        <ChartWrapper
          title="Transactions hebdomadaires"
          subtitle="Volume de transactions par jour"
          value="1,312"
          trend={{ value: 8.2, isPositive: true }}
          actions={
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4" />
            </Button>
          }
        >
          <TransactionBarChart />
        </ChartWrapper>
      </div>

    </div>
  )
}