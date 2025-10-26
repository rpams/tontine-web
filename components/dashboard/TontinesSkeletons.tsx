"use client"

import { Skeleton } from "@/components/ui/skeleton"

// Skeleton pour l'en-tête de la section tontines
export function TontinesHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="bg-white p-4">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-36 rounded" />
    </div>
  )
}

// Skeleton pour les filtres de recherche
export function TontinesFiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 flex-1 rounded" />
        <Skeleton className="w-10 h-10 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-4 rounded" />
      </div>
    </div>
  )
}

// Skeleton pour une carte de tontine
export function TontineCardSkeleton() {
  return (
    <div className="bg-white border rounded-lg p-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center space-x-2 flex-1">
          <Skeleton className="w-6 h-6 rounded" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <div className="flex items-center">
            <Skeleton className="w-3 h-3 mr-1" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <div className="flex items-center">
            <Skeleton className="w-3 h-3 mr-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </div>
  )
}

// Skeleton pour la grille de tontines
export function TontinesGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <TontineCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton pour le bouton "Charger plus"
export function LoadMoreSkeleton() {
  return (
    <div className="flex justify-center pt-6">
      <Skeleton className="h-10 w-48 rounded" />
    </div>
  )
}

// Skeleton complet pour la page Tontines
export function TontinesSkeleton() {
  return (
    <div className="space-y-6">
      <TontinesHeaderSkeleton />
      <TontinesFiltersSkeleton />
      <TontinesGridSkeleton />
      <LoadMoreSkeleton />
    </div>
  )
}

// Export des skeletons individuels
export const TontineSkeletons = {
  Header: TontinesHeaderSkeleton,
  Filters: TontinesFiltersSkeleton,
  Card: TontineCardSkeleton,
  Grid: TontinesGridSkeleton,
  LoadMore: LoadMoreSkeleton,
  Full: TontinesSkeleton
}