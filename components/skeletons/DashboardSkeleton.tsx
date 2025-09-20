"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  User,
  Shield
} from "lucide-react";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      <NavbarDashboard
        userAvatar={"/avatars/avatar-portrait-svgrepo-com.svg"}
        userName="Chargement..."
        userEmail="..."
        userVerification={{ isEmailVerified: false, isDocumentVerified: false }}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* User Info Block Skeleton */}
        <div className="bg-white border p-3 rounded-lg mb-4 max-w-full sm:max-w-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center animate-pulse">
              <div className="w-7 h-7 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span className="text-gray-400 mr-1">@</span>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Identity Verification Skeleton */}
        <div className="bg-white border rounded-lg mb-6">
          {/* Version Mobile */}
          <div className="block sm:hidden p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-green-100 rounded-full w-20 animate-pulse"></div>
              <div className="h-6 bg-green-100 rounded-full w-20 animate-pulse"></div>
              <div className="h-6 bg-green-100 rounded-full w-24 animate-pulse"></div>
            </div>
            <div className="h-9 bg-blue-200 rounded w-full animate-pulse"></div>
          </div>

          {/* Version Desktop */}
          <div className="hidden sm:block p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="h-10 bg-blue-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Section Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-1 bg-white border rounded-lg p-1">
              {[
                { icon: BarChart3, label: "Aperçu" },
                { icon: Users, label: "Tontines" },
                { icon: CreditCard, label: "Paiements" },
                { icon: User, label: "Profil" }
              ].map((tab, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "ghost"}
                  size="sm"
                  disabled
                  className="flex items-center"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 opacity-60">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                <div className="h-3 bg-green-200 rounded w-20 animate-pulse"></div>
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 opacity-60">
                <div className="h-3 bg-blue-200 rounded w-24 animate-pulse"></div>
              </Badge>
              <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 opacity-60">
                <div className="h-3 bg-orange-200 rounded w-20 animate-pulse"></div>
              </Badge>
            </div>
          </div>

          {/* Breadcrumb Skeleton */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-400">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-500">Tableau de bord</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Content Skeleton - Overview style */}
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <div className="h-5 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}