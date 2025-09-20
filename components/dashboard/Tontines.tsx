"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Search,
  Calendar,
  Filter,
  X,
  Trash2,
  MapPin,
  Eye,
  Settings
} from "lucide-react";
import { useState, useMemo } from "react";
import { useTontines } from "@/lib/hooks/useTontines";
import { TontineSkeletons } from "./TontinesSkeletons";

export default function Tontines() {
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string[];
    role: string[];
  }>({
    status: [],
    role: []
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  // Hook pour récupérer toutes les tontines (sans filtres côté serveur)
  const { data: tontinesData, isLoading, error } = useTontines({
    search: "",
    status: [],
    role: [],
    limit: 100, // Récupérer plus de données d'un coup
    offset: 0
  });

  // Filtrage côté client
  const filteredTontines = useMemo(() => {
    if (!tontinesData?.tontines) return [];

    let filtered = tontinesData.tontines;

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tontine =>
        tontine.name.toLowerCase().includes(query) ||
        tontine.description?.toLowerCase().includes(query) ||
        tontine.creator.name.toLowerCase().includes(query)
      );
    }

    // Filtre par statut
    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter(tontine =>
        selectedFilters.status.includes(tontine.status)
      );
    }

    // Filtre par rôle
    if (selectedFilters.role.length > 0) {
      filtered = filtered.filter(tontine => {
        const isOwner = tontine.isOwner;
        return (
          (selectedFilters.role.includes('owner') && isOwner) ||
          (selectedFilters.role.includes('participant') && !isOwner)
        );
      });
    }

    return filtered;
  }, [tontinesData?.tontines, searchQuery, selectedFilters]);

  // Pagination côté client
  const paginatedTontines = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return filteredTontines.slice(0, startIndex + itemsPerPage);
  }, [filteredTontines, currentPage, itemsPerPage]);

  const hasMoreData = paginatedTontines.length < filteredTontines.length;

  // Fonctions de gestion des filtres
  const toggleFilter = (type: 'status' | 'role', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
    setCurrentPage(0); // Reset pagination
  };

  const removeFilter = (type: 'status' | 'role', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
    setCurrentPage(0);
  };

  const clearAllFilters = () => {
    setSelectedFilters({ status: [], role: [] });
    setSearchQuery("");
    setCurrentPage(0);
  };

  // Configuration des filtres
  const filterConfig = {
    status: [
      { value: 'ACTIVE', label: 'En cours', color: 'green' },
      { value: 'DRAFT', label: 'Planifiée', color: 'blue' },
      { value: 'COMPLETED', label: 'Terminée', color: 'red' },
      { value: 'CANCELLED', label: 'Annulée', color: 'gray' }
    ],
    role: [
      { value: 'owner', label: 'Créateur', icon: Users },
      { value: 'participant', label: 'Participant', icon: Users }
    ]
  };

  // Fonction pour obtenir les couleurs des badges de statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'DRAFT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'En cours';
      case 'COMPLETED': return 'Terminée';
      case 'DRAFT': return 'Planifiée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  const getIconForTontine = (tontine: any) => {
    // Logic basée sur le nom ou d'autres critères
    const name = tontine.name?.toLowerCase() || '';
    if (name.includes('famille')) return { icon: Users, bg: 'bg-green-100', color: 'text-green-600' };
    if (name.includes('business') || name.includes('entreprise')) return { icon: TrendingUp, bg: 'bg-purple-100', color: 'text-purple-600' };
    if (name.includes('épargne') || name.includes('projet')) return { icon: DollarSign, bg: 'bg-blue-100', color: 'text-blue-600' };
    if (name.includes('santé')) return { icon: Users, bg: 'bg-red-100', color: 'text-red-600' };
    if (name.includes('éducation')) return { icon: Users, bg: 'bg-yellow-100', color: 'text-yellow-600' };
    if (name.includes('vacances') || name.includes('voyage')) return { icon: MapPin, bg: 'bg-indigo-100', color: 'text-indigo-600' };
    return { icon: Users, bg: 'bg-gray-100', color: 'text-gray-600' };
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">Erreur de chargement</div>
          <p className="text-sm text-gray-600">
            Impossible de charger les tontines
          </p>
        </div>
      </div>
    );
  }

  // Affichage du loading
  if (isLoading) {
    return <TontineSkeletons.Full />;
  }

  const tontines = paginatedTontines;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">Mes Tontines</h2>
          <p className="text-gray-600">Gérez toutes vos tontines en un seul endroit</p>
        </div>
        <Button className="flex items-center sm:flex-shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Créer une tontine
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        {/* Search Bar & Filters Row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 bg-white">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une tontine par nom, montant ou participants..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-10 h-10 p-0" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* Filtres par statut */}
              {filterConfig.status.map(statusFilter => (
                <DropdownMenuCheckboxItem
                  key={statusFilter.value}
                  checked={selectedFilters.status.includes(statusFilter.value)}
                  onCheckedChange={() => toggleFilter('status', statusFilter.value)}
                >
                  <div className={`w-2 h-2 bg-${statusFilter.color}-500 rounded-full mr-2`}></div>
                  {statusFilter.label}
                </DropdownMenuCheckboxItem>
              ))}

              {/* Séparateur */}
              <div className="h-px bg-gray-200 my-1" />

              {/* Filtres par rôle */}
              {filterConfig.role.map(roleFilter => {
                const IconComponent = roleFilter.icon;
                return (
                  <DropdownMenuCheckboxItem
                    key={roleFilter.value}
                    checked={selectedFilters.role.includes(roleFilter.value)}
                    onCheckedChange={() => toggleFilter('role', roleFilter.value)}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {roleFilter.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Selected Filters as Badges */}
        {(selectedFilters.status.length > 0 || selectedFilters.role.length > 0 || searchQuery) && (
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-2 flex-1">
              {/* Badges pour les filtres de statut */}
              {selectedFilters.status.map(status => {
                const statusConfig = filterConfig.status.find(s => s.value === status);
                return (
                  <Badge
                    key={status}
                    className={`flex items-center gap-1 bg-${statusConfig?.color}-500 hover:bg-${statusConfig?.color}-600 text-white border-${statusConfig?.color}-500`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {statusConfig?.label}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
                      onClick={() => removeFilter('status', status)}
                    />
                  </Badge>
                );
              })}

              {/* Badges pour les filtres de rôle */}
              {selectedFilters.role.map(role => {
                const roleConfig = filterConfig.role.find(r => r.value === role);
                if (!roleConfig) return null;
                const IconComponent = roleConfig.icon;
                return (
                  <Badge
                    key={role}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  >
                    <IconComponent className="w-3 h-3" />
                    {roleConfig.label}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
                      onClick={() => removeFilter('role', role)}
                    />
                  </Badge>
                );
              })}

              {/* Badge pour la recherche */}
              {searchQuery && (
                <Badge className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500">
                  <Search className="w-3 h-3" />
                  "{searchQuery}"
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500 p-1 h-auto"
              onClick={clearAllFilters}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Tontines Grid */}
      {tontines.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          {filteredTontines.length === 0 && !searchQuery && selectedFilters.status.length === 0 && selectedFilters.role.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tontine trouvée</h3>
              <p className="text-gray-500 text-sm mb-4">Créez votre première tontine pour commencer</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer une tontine
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-500 text-sm">
                Aucune tontine ne correspond à vos critères de recherche
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tontines.map((tontine) => {
            const iconConfig = getIconForTontine(tontine);
            const IconComponent = iconConfig.icon;

            return (
              <div
                key={tontine.id}
                className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer group"
                onClick={() => window.location.href = `/tontines/${tontine.id}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className={`w-6 h-6 ${iconConfig.bg} rounded flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-3 h-3 ${iconConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{tontine.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{tontine.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${getStatusBadgeColor(tontine.status)} text-xs px-2 py-0.5 flex-shrink-0`}>
                    {getStatusLabel(tontine.status)}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Montant</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {tontine.amountPerRound.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Participants</span>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">{tontine.participantCount}</span>
                      {tontine.maxParticipants && (
                        <span className="text-xs text-gray-400">/{tontine.maxParticipants}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Prochain tour</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-700">
                        {tontine.nextRound
                          ? `dans ${tontine.nextRound.daysUntil} jour${tontine.nextRound.daysUntil > 1 ? 's' : ''}`
                          : 'Pas de tour prévu'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Badge pour le rôle de l'utilisateur */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Votre rôle</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-0.5 ${
                        tontine.isOwner
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {tontine.isOwner ? 'Créateur' : 'Participant'}
                    </Badge>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-2 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {tontine.participants.slice(0, 3).map((participant, i) => (
                      <Avatar key={participant.id} className="w-5 h-5 border border-white">
                        <AvatarImage src={participant.avatarUrl || `/avatars/0${i + 1}.png`} />
                        <AvatarFallback className="text-xs">
                          {participant.firstName?.[0] || participant.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {tontine.participantCount > 3 && (
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center border border-white">
                        <span className="text-xs text-gray-600">+{tontine.participantCount - 3}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                    <Eye className="w-3 h-3" />
                  </Button>
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
            {isLoading ? 'Chargement...' : 'Charger plus de tontines'}
          </Button>
        </div>
      )}
    </div>
  );
}