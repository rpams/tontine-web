"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Shield,
  Zap,
  Crown
} from "lucide-react";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";

export default function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-stone-100/90 relative" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      {/* Admin Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 opacity-30"></div>
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-purple-300 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-4 border-blue-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 border-4 border-green-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-40 right-40 w-20 h-20 border-4 border-yellow-300 rounded-full opacity-20"></div>
      </div>

      <NavbarDashboard
        userAvatar={"/avatars/avatar-portrait-svgrepo-com.svg"}
        userName="Admin..."
        userEmail="admin@..."
        userVerification={{ isEmailVerified: true, isDocumentVerified: true }}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-4 md:py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-poppins">Panneau d'Administration</h1>
                <p className="text-gray-600">Gestion complète de la plateforme</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1 animate-pulse">
                <Crown className="w-3 h-3 mr-1" />
                Administrateur
              </Badge>
            </div>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-gray-400">Tableau de bord</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-500">Administration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 bg-white/80 backdrop-blur-sm border rounded-xl p-2 shadow-sm">
            {[
              { icon: BarChart3, label: "Aperçu", id: "overview" },
              { icon: Users, label: "Utilisateurs", id: "users" },
              { icon: Shield, label: "Tontines", id: "tontines" },
              { icon: CreditCard, label: "Paiements", id: "payments" },
              { icon: Settings, label: "Paramètres", id: "settings" }
            ].map((tab, index) => (
              <Button
                key={tab.id}
                variant={index === 0 ? "default" : "ghost"}
                size="sm"
                disabled
                className="flex items-center relative overflow-hidden"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {index === 0 && <Zap className="w-3 h-3 ml-1 animate-pulse" />}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Content Skeleton */}
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Utilisateurs", color: "from-blue-500 to-blue-600" },
              { icon: Shield, label: "Tontines", color: "from-green-500 to-green-600" },
              { icon: CreditCard, label: "Transactions", color: "from-purple-500 to-purple-600" },
              { icon: BarChart3, label: "Revenus", color: "from-orange-500 to-orange-600" }
            ].map((stat, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-md bg-white/90 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Utilisateurs récents</span>
                  </CardTitle>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Tontines */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Tontines récentes</span>
                  </CardTitle>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Transactions récentes</span>
                </CardTitle>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-28 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}