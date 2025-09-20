"use client"

import { Skeleton } from "@/components/ui/skeleton"

// Skeleton pour l'en-tête de la section paiements
export function PaymentsHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:flex-shrink-0">
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-36 rounded" />
      </div>
    </div>
  )
}

// Skeleton pour les cartes de statistiques
export function PaymentsStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton pour les filtres de recherche
export function PaymentsFiltersSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative bg-white">
        <Skeleton className="h-10 w-full rounded" />
      </div>
      <div className="flex flex-col xs:flex-row gap-2">
        <div className="flex flex-1 gap-2">
          <Skeleton className="h-10 flex-1 xs:flex-none xs:min-w-[120px] rounded" />
          <Skeleton className="h-10 flex-1 xs:flex-none xs:min-w-[120px] rounded" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-7 w-7 rounded" />
      </div>
    </div>
  )
}

// Skeleton pour un élément de paiement
export function PaymentItemSkeleton() {
  return (
    <div className="bg-white border rounded-lg p-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Skeleton className="w-8 h-8 rounded" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-48 mb-1" />
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end sm:space-x-3">
          <div className="text-left sm:text-right">
            <Skeleton className="h-5 w-28 mb-1" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton pour la liste des paiements
export function PaymentsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <PaymentItemSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton pour le bouton "Charger plus"
export function LoadMorePaymentsSkeleton() {
  return (
    <div className="flex justify-center pt-6">
      <Skeleton className="h-10 w-56 rounded" />
    </div>
  )
}

// Skeleton complet pour la page Paiements
export function PaymentsSkeleton() {
  return (
    <div className="space-y-6">
      <PaymentsHeaderSkeleton />
      <PaymentsStatsSkeleton />
      <PaymentsFiltersSkeleton />
      <PaymentsListSkeleton />
      <LoadMorePaymentsSkeleton />
    </div>
  )
}

// Export des skeletons individuels
export const PaymentSkeletons = {
  Header: PaymentsHeaderSkeleton,
  Stats: PaymentsStatsSkeleton,
  Filters: PaymentsFiltersSkeleton,
  Item: PaymentItemSkeleton,
  List: PaymentsListSkeleton,
  LoadMore: LoadMorePaymentsSkeleton,
  Full: PaymentsSkeleton
}