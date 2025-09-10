"use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Tontines() {
  const tontines = [
    {
      id: 'famille',
      name: 'Tontine Famille',
      amount: '85 000 FCFA',
      participants: 12,
      status: 'En cours',
      statusColor: 'bg-green-500',
      nextTurn: 'dans 5 jours',
      icon: Users,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      description: 'Épargne familiale mensuelle'
    },
    {
      id: 'epargne-projet',
      name: 'Épargne Projet',
      amount: '120 000 FCFA',
      participants: 8,
      status: 'Terminée',
      statusColor: 'bg-red-500',
      nextTurn: 'terminée il y a 3 jours',
      icon: DollarSign,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      description: 'Financement projet immobilier'
    },
    {
      id: 'business',
      name: 'Tontine Business',
      amount: '25 000 FCFA',
      participants: 6,
      status: 'À venir',
      statusColor: 'bg-blue-500',
      nextTurn: 'démarre dans 3 jours',
      icon: TrendingUp,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      description: 'Réseau entrepreneurs locaux'
    },
    {
      id: 'education',
      name: 'Épargne Éducation',
      amount: '45 000 FCFA',
      participants: 10,
      status: 'En cours',
      statusColor: 'bg-green-500',
      nextTurn: 'dans 12 jours',
      icon: Users,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      description: 'Frais scolaires des enfants'
    },
    {
      id: 'sante',
      name: 'Fonds Santé',
      amount: '75 000 FCFA',
      participants: 15,
      status: 'En cours',
      statusColor: 'bg-green-500',
      nextTurn: 'dans 8 jours',
      icon: Users,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      description: 'Mutuelle santé communautaire'
    },
    {
      id: 'vacances',
      name: 'Tontine Vacances',
      amount: '35 000 FCFA',
      participants: 7,
      status: 'Planifiée',
      statusColor: 'bg-orange-500',
      nextTurn: 'démarre dans 15 jours',
      icon: MapPin,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      description: 'Voyages et loisirs'
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Terminée':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'À venir':
      case 'Planifiée':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-10 h-10 p-0" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuCheckboxItem checked>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                En cours
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Planifiée
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                À venir
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Terminée
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                <Users className="w-4 h-4 mr-2" />
                Créateur
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <Users className="w-4 h-4 mr-2" />
                Participant
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        
        {/* Selected Filters as Badges */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-2 flex-1">
            <Badge className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              En cours
              <X className="w-3 h-3 ml-1 cursor-pointer hover:text-emerald-200" />
            </Badge>
            <Badge className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500">
              <Users className="w-3 h-3" />
              Créateur
              <X className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-200" />
            </Badge>
          </div>
          
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 p-1 h-auto">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tontines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tontines.map((tontine) => {
          const IconComponent = tontine.icon;
          return (
            <div 
              key={tontine.id}
              className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer group"
              onClick={() => window.location.href = `/tontines/${tontine.id}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className={`w-6 h-6 ${tontine.iconBg} rounded flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-3 h-3 ${tontine.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{tontine.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{tontine.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={`${getStatusBadgeColor(tontine.status)} text-xs px-2 py-0.5 flex-shrink-0`}>
                  {tontine.status}
                </Badge>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Montant</span>
                  <span className="text-sm font-semibold text-gray-900">{tontine.amount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Participants</span>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{tontine.participants}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Prochain tour</span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="text-xs text-gray-700">{tontine.nextTurn}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2 border-t flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(2, tontine.participants))].map((_, i) => (
                    <Avatar key={i} className="w-5 h-5 border border-white">
                      <AvatarImage src={`/avatars/0${i + 1}.png`} />
                      <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                  {tontine.participants > 2 && (
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center border border-white">
                      <span className="text-xs text-gray-600">+{tontine.participants - 2}</span>
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

      {/* Load More Button */}
      <div className="flex justify-center pt-6">
        <Button variant="outline" size="lg">
          Charger plus de tontines
        </Button>
      </div>
    </div>
  );
}