"use client"

import { Skeleton } from "@/components/ui/skeleton"

// Skeleton pour les cartes de statistiques
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
          <Skeleton className="h-6 w-24 mb-0.5" />
          <div className="flex items-center">
            <Skeleton className="h-2.5 w-2.5 rounded-full mr-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton pour une tontine dans la liste
export function TontineItemSkeleton() {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-6 h-6 rounded" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Skeleton className="w-3 h-3 mr-1" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center">
          <Skeleton className="w-3 h-3 mr-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

// Skeleton pour la section des tontines
export function TontinesSectionSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-6 w-28 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-16 rounded" />
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 flex-1 rounded" />
          <Skeleton className="w-10 h-10 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-4 rounded" />
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 3 }, (_, i) => (
          <TontineItemSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Skeleton pour un tour dans l'onglet
export function TourItemSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg border px-4">
      <Skeleton className="w-4 h-4" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-20 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

// Skeleton pour la section des tours
export function ToursSectionSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <Skeleton className="h-6 w-28 mb-1" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Skeleton className="h-8 flex-1 rounded" />
          <Skeleton className="h-8 flex-1 rounded" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 2 }, (_, i) => (
          <TourItemSkeleton key={i} />
        ))}
      </div>

      <div className="mt-4 text-center">
        <Skeleton className="h-8 w-20 mx-auto rounded" />
      </div>
    </div>
  )
}

// Skeleton pour les actions rapides
export function QuickActionsSkeleton() {
  return (
    <div className="bg-white border rounded-lg">
      <div className="p-6 pb-4">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="px-6 pb-6 space-y-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="w-4 h-4 mr-2" />
            <Skeleton className="h-8 flex-1 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton complet pour l'aperçu
export function OverviewSkeleton() {
  return (
    <>
      <StatsCardsSkeleton />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 lg:flex-[2] space-y-6">
          <TontinesSectionSkeleton />
        </div>

        <div className="hidden lg:block w-px bg-gray-200" />

        <div className="flex-1 space-y-6">
          <ToursSectionSkeleton />
          <QuickActionsSkeleton />
        </div>
      </div>
    </>
  )
}

// Skelons individuels pour des parties spécifiques
export const DashboardSkeletons = {
  StatsCards: StatsCardsSkeleton,
  TontinesSection: TontinesSectionSkeleton,
  ToursSection: ToursSectionSkeleton,
  QuickActions: QuickActionsSkeleton,
  TontineItem: TontineItemSkeleton,
  TourItem: TourItemSkeleton,
  Overview: OverviewSkeleton
}