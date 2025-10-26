"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  Search,
  Filter,
  X,
  Trash2,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useState, useMemo } from "react";
import { usePayments } from "@/lib/hooks/usePayments";
import { PaymentSkeletons } from "./PaymentsSkeletons";

export default function Payments() {
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string[];
    type: string[];
  }>({
    status: [],
    type: []
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  // Hook pour récupérer tous les paiements (sans filtres côté serveur)
  const { data: paymentsData, isLoading, error } = usePayments({
    search: "",
    status: [],
    type: [],
    limit: 100, // Récupérer plus de données d'un coup
    offset: 0
  });

  // Filtrage côté client
  const filteredPayments = useMemo(() => {
    if (!paymentsData?.payments) return [];

    let filtered = paymentsData.payments;

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.tontine.name.toLowerCase().includes(query) ||
        payment.reference.toLowerCase().includes(query) ||
        payment.recipient.toLowerCase().includes(query) ||
        payment.transactionId?.toLowerCase().includes(query) ||
        payment.notes?.toLowerCase().includes(query)
      );
    }

    // Filtre par statut
    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter(payment =>
        selectedFilters.status.includes(payment.status)
      );
    }

    // Filtre par type
    if (selectedFilters.type.length > 0) {
      filtered = filtered.filter(payment =>
        selectedFilters.type.includes(payment.type)
      );
    }

    return filtered;
  }, [paymentsData?.payments, searchQuery, selectedFilters]);

  // Pagination côté client
  const paginatedPayments = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return filteredPayments.slice(0, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  const hasMoreData = paginatedPayments.length < filteredPayments.length;

  // Fonctions de gestion des filtres
  const toggleFilter = (type: 'status' | 'type', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
    setCurrentPage(0);
  };

  const removeFilter = (type: 'status' | 'type', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
    setCurrentPage(0);
  };

  const clearAllFilters = () => {
    setSelectedFilters({ status: [], type: [] });
    setSearchQuery("");
    setCurrentPage(0);
  };

  // Configuration des filtres
  const filterConfig = {
    status: [
      { value: 'PAID', label: 'Payé', color: 'green', icon: CheckCircle },
      { value: 'PENDING', label: 'En attente', color: 'yellow', icon: Clock },
      { value: 'FAILED', label: 'Échoué', color: 'red', icon: XCircle },
      { value: 'CANCELLED', label: 'Annulé', color: 'gray', icon: AlertCircle }
    ],
    type: [
      { value: 'CONTRIBUTION', label: 'Contribution', icon: TrendingDown },
      { value: 'GAIN', label: 'Gain', icon: TrendingUp }
    ]
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500',
          label: 'Payé'
        };
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          iconColor: 'text-yellow-500',
          label: 'En attente'
        };
      case 'FAILED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-500',
          label: 'Échoué'
        };
      case 'CANCELLED':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-500',
          label: 'Annulé'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-500',
          label: status
        };
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'CONTRIBUTION':
        return {
          color: 'text-red-600',
          icon: TrendingDown,
          prefix: '-',
          label: 'Contribution'
        };
      case 'GAIN':
        return {
          color: 'text-green-600',
          icon: TrendingUp,
          prefix: '+',
          label: 'Gain'
        };
      default:
        return {
          color: 'text-gray-600',
          icon: DollarSign,
          prefix: '',
          label: type
        };
    }
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">Erreur de chargement</div>
          <p className="text-sm text-gray-600">
            Impossible de charger les paiements
          </p>
        </div>
      </div>
    );
  }

  // Affichage du loading seulement si aucune donnée n'est disponible
  if (isLoading && !paymentsData) {
    return <PaymentSkeletons.Full />;
  }

  const payments = paginatedPayments;
  const stats = paymentsData?.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">Mes Paiements</h2>
          <p className="text-gray-600">Historique complet de tous vos paiements et réceptions</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:flex-shrink-0">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          {/* <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau paiement
          </Button> */}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total payé</p>
              <p className="text-base font-bold text-red-600">
                -{(stats?.totalPaid || 0).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total reçu</p>
              <p className="text-base font-bold text-green-600">
                +{(stats?.totalReceived || 0).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">En attente</p>
              <p className="text-base font-bold text-yellow-600">
                {(stats?.pendingAmount || 0).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Ce mois</p>
              <p className="text-base font-bold text-blue-600">
                {stats?.thisMonthTransactions || 0} transactions
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        {/* Search Bar & Filter Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 bg-white">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par référence, tontine ou bénéficiaire..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                <Filter className="w-4 h-4" />
                Filtres
                {(selectedFilters.status.length > 0 || selectedFilters.type.length > 0) && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                    {selectedFilters.status.length + selectedFilters.type.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              {/* Section Statut */}
              <div className="px-2 py-1.5">
                <div className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Statut du paiement
                </div>
                <div className="space-y-1">
                  {filterConfig.status.map(statusFilter => {
                    const IconComponent = statusFilter.icon;
                    return (
                      <DropdownMenuCheckboxItem
                        key={statusFilter.value}
                        checked={selectedFilters.status.includes(statusFilter.value)}
                        onCheckedChange={() => toggleFilter('status', statusFilter.value)}
                        className="text-sm"
                      >
                        <IconComponent className={`w-4 h-4 mr-2 text-${statusFilter.color}-500`} />
                        {statusFilter.label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </div>
              </div>

              {/* Séparateur */}
              <div className="h-px bg-gray-200 my-2" />

              {/* Section Type */}
              <div className="px-2 py-1.5">
                <div className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Type de transaction
                </div>
                <div className="space-y-1">
                  {filterConfig.type.map(typeFilter => {
                    const IconComponent = typeFilter.icon;
                    return (
                      <DropdownMenuCheckboxItem
                        key={typeFilter.value}
                        checked={selectedFilters.type.includes(typeFilter.value)}
                        onCheckedChange={() => toggleFilter('type', typeFilter.value)}
                        className="text-sm"
                      >
                        <IconComponent className={`w-4 h-4 mr-2 ${typeFilter.value === 'CONTRIBUTION' ? 'text-red-500' : 'text-green-500'}`} />
                        {typeFilter.label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </div>
              </div>

              {/* Actions en bas */}
              {(selectedFilters.status.length > 0 || selectedFilters.type.length > 0) && (
                <>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="px-2 py-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-gray-500 hover:text-red-500"
                      onClick={clearAllFilters}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Effacer tous les filtres
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Selected Filters with Reset Button */}
        {(selectedFilters.status.length > 0 || selectedFilters.type.length > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Badges pour les filtres de statut */}
            {selectedFilters.status.map(status => {
              const statusConfig = filterConfig.status.find(s => s.value === status);
              if (!statusConfig) return null;
              const IconComponent = statusConfig.icon;
              return (
                <Badge
                  key={status}
                  className={`flex items-center gap-1 bg-${statusConfig.color}-500 hover:bg-${statusConfig.color}-600 text-white border-${statusConfig.color}-500 text-xs`}
                >
                  <IconComponent className="w-3 h-3" />
                  {statusConfig.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
                    onClick={() => removeFilter('status', status)}
                  />
                </Badge>
              );
            })}

            {/* Badges pour les filtres de type */}
            {selectedFilters.type.map(type => {
              const typeConfig = filterConfig.type.find(t => t.value === type);
              if (!typeConfig) return null;
              const IconComponent = typeConfig.icon;
              const bgColor = type === 'CONTRIBUTION' ? 'red' : 'green';
              return (
                <Badge
                  key={type}
                  className={`flex items-center gap-1 bg-${bgColor}-500 hover:bg-${bgColor}-600 text-white border-${bgColor}-500 text-xs`}
                >
                  <IconComponent className="w-3 h-3" />
                  {typeConfig.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
                    onClick={() => removeFilter('type', type)}
                  />
                </Badge>
              );
            })}

            {/* Badge pour la recherche */}
            {searchQuery && (
              <Badge className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500 text-xs">
                <Search className="w-3 h-3" />
                "{searchQuery}"
                <X
                  className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
              onClick={clearAllFilters}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-md">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          {filteredPayments.length === 0 && !searchQuery && selectedFilters.status.length === 0 && selectedFilters.type.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun paiement trouvé</h3>
              <p className="text-gray-500 text-sm mb-4">Vos transactions apparaîtront ici</p>
              {/* <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau paiement
              </Button> */}
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-500 text-sm">
                Aucun paiement ne correspond à vos critères de recherche
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            const typeConfig = getTypeConfig(payment.type);
            const StatusIcon = statusConfig.icon;
            const TypeIcon = typeConfig.icon;

            return (
              <div key={payment.id} className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{payment.tontine.name}</h3>
                        <Badge variant="secondary" className={`${statusConfig.color} text-xs px-2 py-0.5`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        Tour {payment.round.roundNumber} - {payment.recipient}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                        {payment.paymentMethod && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {payment.paymentMethod}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{payment.reference}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:space-x-3 mt-2 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <div className={`flex items-center font-bold text-base ${typeConfig.color}`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        <span>{typeConfig.prefix}{payment.amount.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <Badge variant="outline" className="mt-0.5 text-xs px-1.5 py-0.5">
                        {typeConfig.label}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {hasMoreData && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : 'Charger plus de transactions'}
          </Button>
        </div>
      )}
    </div>
  );
}