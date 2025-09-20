"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Settings,
  Search,
  Calendar,
  ArrowUpRight,
  Filter,
  X,
  Trash2,
  Trophy,
  Coins,
  Eye
} from "lucide-react";
import { useState } from "react";
import { useDashboardStats, useDashboardTontines, useDashboardTours } from "@/lib/hooks/useDashboard";
import { DashboardSkeletons } from "./OverviewSkeletons";

export default function Overview() {
  const [activeTab, setActiveTab] = useState("gains");

  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string[];
    role: string[];
  }>({
    status: [],
    role: []
  });

  // Utiliser les hooks pour récupérer les données
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: tontinesData, isLoading: tontinesLoading, error: tontinesError } = useDashboardTontines(20); // Plus de données pour le filtrage
  const { data: toursData, isLoading: toursLoading, error: toursError } = useDashboardTours();

  // Gestion des erreurs
  if (statsError || tontinesError || toursError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">Erreur de chargement</div>
          <p className="text-sm text-gray-600">
            Impossible de charger les données du tableau de bord
          </p>
        </div>
      </div>
    );
  }

  // Affichage du loading seulement si aucune donnée n'est disponible
  if ((statsLoading && !stats) || (tontinesLoading && !tontinesData) || (toursLoading && !toursData)) {
    return <DashboardSkeletons.Overview />;
  }

  const allTontines = tontinesData?.tontines || [];
  const gains = toursData?.gains || [];
  const contributions = toursData?.contributions || [];

  // Fonction de filtrage et recherche
  const filteredTontines = allTontines.filter(tontine => {
    // Recherche par nom
    const matchesSearch = searchQuery === "" ||
      tontine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tontine.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtrage par statut
    const matchesStatus = selectedFilters.status.length === 0 ||
      selectedFilters.status.includes(tontine.status);

    // Filtrage par rôle
    const matchesRole = selectedFilters.role.length === 0 ||
      (selectedFilters.role.includes('owner') && tontine.isOwner) ||
      (selectedFilters.role.includes('participant') && !tontine.isOwner);

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Fonctions de gestion des filtres
  const toggleFilter = (type: 'status' | 'role', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const removeFilter = (type: 'status' | 'role', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({ status: [], role: [] });
    setSearchQuery("");
  };

  // Formatage des données pour compatibilité avec l'affichage existant
  const allGains = gains.map(gain => ({
    name: gain.tontineName,
    tour: gain.roundNumber,
    date: `Dans ${gain.daysUntil} jour${gain.daysUntil > 1 ? 's' : ''}`,
    amount: `${gain.amount.toLocaleString('fr-FR')} FCFA`,
    status: gain.isConfirmed ? "confirmed" : "pending"
  }));

  const allContributions = contributions.map(contribution => ({
    name: contribution.tontineName,
    tour: contribution.roundNumber,
    date: `Dans ${contribution.daysUntil} jour${contribution.daysUntil > 1 ? 's' : ''}`,
    amount: `${contribution.amount.toLocaleString('fr-FR')} FCFA`,
    status: contribution.isConfirmed ? "confirmed" : "pending"
  }));

  // Configuration des filtres disponibles
  const filterConfig = {
    status: [
      { value: 'ACTIVE', label: 'Active', color: 'green' },
      { value: 'DRAFT', label: 'Planifiée', color: 'blue' },
      { value: 'COMPLETED', label: 'Terminée', color: 'gray' },
      { value: 'CANCELLED', label: 'Annulée', color: 'red' }
    ],
    role: [
      { value: 'owner', label: 'Créateur', icon: Users },
      { value: 'participant', label: 'Participant', icon: Users }
    ]
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Total épargné</span>
            <DollarSign className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">
            {stats?.totalSaved.toLocaleString('fr-FR')} FCFA
          </div>
          <div className="flex items-center text-xs text-green-600">
            <ArrowUpRight className="w-2.5 h-2.5 mr-1" />
            +20.1% ce mois
          </div>
        </div>

        <div className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Mes tontines</span>
            <Users className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">
            {stats?.totalTontines}
          </div>
          <div className="flex items-center text-xs text-blue-600">
            <ArrowUpRight className="w-2.5 h-2.5 mr-1" />
            {stats?.recentActivity.newTontinesThisMonth} nouvelles ce mois
          </div>
        </div>

        <div className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Prochain tour</span>
            <Clock className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">
            {stats?.nextTontine ? `${stats.nextTontine.daysUntil} jours` : 'Aucun'}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-2.5 h-2.5 mr-1" />
            {stats?.nextTontine?.name || 'Pas de tour prévu'}
          </div>
        </div>

        <div className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Rendement</span>
            <TrendingUp className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">
            {stats?.avgReturn.toFixed(1)}%
          </div>
          <div className="flex items-center text-xs text-green-600">
            <ArrowUpRight className="w-2.5 h-2.5 mr-1" />
            Très bon
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Mes Tontines */}
        <div className="flex-1 lg:flex-[2] space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-poppins">Mes Tontines</h3>
                <p className="text-sm text-gray-600">Cette semaine</p>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
            
            {/* Search & Filters */}
            <div className="space-y-3 mb-6">
              {/* Search Bar & Filters Row */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 bg-white">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une tontine..."
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
            <div className="space-y-2">
              {filteredTontines.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  {allTontines.length === 0 ? (
                    <>
                      <p className="text-gray-500 text-sm">Aucune tontine trouvée</p>
                      <p className="text-gray-400 text-xs">Créez votre première tontine</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm">Aucun résultat trouvé</p>
                      <p className="text-gray-400 text-xs">Essayez de modifier vos critères de recherche</p>
                    </>
                  )}
                </div>
              ) : (
                filteredTontines.slice(0, 3).map((tontine) => {
                  const statusConfig = {
                    'ACTIVE': { color: 'green', label: 'En cours' },
                    'COMPLETED': { color: 'red', label: 'Terminée' },
                    'DRAFT': { color: 'blue', label: 'À venir' },
                    'CANCELLED': { color: 'gray', label: 'Annulée' }
                  };

                  const status = statusConfig[tontine.status as keyof typeof statusConfig] || statusConfig.DRAFT;

                  return (
                    <div
                      key={tontine.id}
                      className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => window.location.href = `/tontines/${tontine.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 bg-${status.color}-100 rounded flex items-center justify-center`}>
                            {tontine.isOwner ? (
                              <Users className={`w-3 h-3 text-${status.color}-600`} />
                            ) : (
                              <DollarSign className={`w-3 h-3 text-${status.color}-600`} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 font-poppins">
                              {tontine.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {tontine.amountPerRound.toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`bg-${status.color}-100 text-${status.color}-800 border-${status.color}-200 text-xs px-2 py-0.5`}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        {tontine.nextRound ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Dans {tontine.nextRound.daysUntil} jour{tontine.nextRound.daysUntil > 1 ? 's' : ''}
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3 h-3 mr-1" />
                            Pas de tour prévu
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <Users className="w-3 h-3 mr-1" />
                        {tontine.participantCount} participant{tontine.participantCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator orientation="vertical" className="hidden lg:block" />

        {/* Right Column - Tours & Actions */}
        <div className="flex-1 space-y-6">
          {/* Tours à venir */}
          <div>
            <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">Tours à venir</h3>
            <p className="text-sm text-gray-600">Cette semaine</p>
            </div>
            <Tabs defaultValue="gains" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gains">
                  <Trophy className="w-4 h-4 mr-2" />
                  Mes gains
                </TabsTrigger>
                <TabsTrigger value="contributions">
                  <Coins className="w-4 h-4 mr-2" />
                  Contributions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gains" className="mt-4">
                <div className="space-y-3">
                  {gains.length === 0 ? (
                    <div className="text-center py-6">
                      <Trophy className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Aucun gain prévu</p>
                    </div>
                  ) : (
                    gains.slice(0, 2).map((gain) => (
                      <div key={gain.id} className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-300 px-4">
                        <Trophy className="w-4 h-4 text-green-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-green-900">{gain.tontineName}</div>
                          <div className="text-xs text-green-700">
                            Tour {gain.roundNumber} - Dans {gain.daysUntil} jour{gain.daysUntil > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            {gain.amount.toLocaleString('fr-FR')} FCFA
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="contributions" className="mt-4">
                <div className="space-y-3">
                  {contributions.length === 0 ? (
                    <div className="text-center py-6">
                      <Coins className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Aucune contribution prévue</p>
                    </div>
                  ) : (
                    contributions.slice(0, 3).map((contribution) => (
                      <div key={contribution.id} className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-300 px-4">
                        <Coins className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-900">{contribution.tontineName}</div>
                          <div className="text-xs text-blue-700">
                            Tour {contribution.roundNumber} - Dans {contribution.daysUntil} jour{contribution.daysUntil > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            {contribution.amount.toLocaleString('fr-FR')} FCFA
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Bouton Voir tout */}
            <div className="mt-4 text-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium">
                    Voir tout
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader className="px-4 sm:px-6">
                    <SheetTitle className="text-lg font-semibold">Tours à venir</SheetTitle>
                    <SheetDescription className="text-sm">
                      Tous vos gains et contributions prévus
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-4 sm:mt-6 px-4 sm:px-6">
                    <Tabs defaultValue="gains" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="gains" className="text-sm">
                          <Trophy className="w-4 h-4 mr-2" />
                          Mes gains
                        </TabsTrigger>
                        <TabsTrigger value="contributions" className="text-sm">
                          <Coins className="w-4 h-4 mr-2" />
                          Contributions
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="gains" className="mt-3 sm:mt-4">
                        <div className="space-y-2 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-250px)] overflow-y-auto pr-1 sm:pr-2">
                          {allGains.map((item, index) => (
                            <div key={index} className="group relative">
                              <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-green-50 to-green-25 border border-green-200 hover:border-green-300 hover:shadow-sm transition-all duration-200">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs sm:text-sm font-semibold text-green-900 truncate pr-1 sm:pr-2">
                                      {item.name}
                                    </h4>
                                    <Badge 
                                      className={`text-xs flex-shrink-0 px-1.5 sm:px-2 py-0.5 ${
                                        item.status === "confirmed" 
                                          ? "bg-green-500 hover:bg-green-600 text-white border-green-500" 
                                          : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
                                      }`}
                                    >
                                      {item.status === "confirmed" ? "✓" : "⏳"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <div className="flex items-center text-xs text-green-700">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      <span className="hidden sm:inline">Tour {item.tour} • </span>
                                      <span className="sm:hidden">T{item.tour} • </span>
                                      {item.date}
                                    </div>
                                    <div className="text-xs sm:text-sm font-bold text-green-800">
                                      {item.amount.replace(' FCFA', '').replace(' ', 'K')} 
                                      <span className="hidden sm:inline"> FCFA</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="contributions" className="mt-3 sm:mt-4">
                        <div className="space-y-2 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-250px)] overflow-y-auto pr-1 sm:pr-2">
                          {allContributions.map((item, index) => (
                            <div key={index} className="group relative">
                              <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                  <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs sm:text-sm font-semibold text-blue-900 truncate pr-1 sm:pr-2">
                                      {item.name}
                                    </h4>
                                    <Badge 
                                      className={`text-xs flex-shrink-0 px-1.5 sm:px-2 py-0.5 ${
                                        item.status === "confirmed" 
                                          ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500" 
                                          : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
                                      }`}
                                    >
                                      {item.status === "confirmed" ? "✓" : "⏳"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <div className="flex items-center text-xs text-blue-700">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      <span className="hidden sm:inline">Tour {item.tour} • </span>
                                      <span className="sm:hidden">T{item.tour} • </span>
                                      {item.date}
                                    </div>
                                    <div className="text-xs sm:text-sm font-bold text-blue-800">
                                      {item.amount.replace(' FCFA', '').replace(' ', 'K')} 
                                      <span className="hidden sm:inline"> FCFA</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}