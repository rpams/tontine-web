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
  Coins
} from "lucide-react";

export default function Overview() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Total épargné</span>
            <DollarSign className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">245 000 FCFA</div>
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
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">8</div>
          <div className="flex items-center text-xs text-blue-600">
            <ArrowUpRight className="w-2.5 h-2.5 mr-1" />
            2 nouvelles ce mois
          </div>
        </div>

        <div className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Prochain tour</span>
            <Clock className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">5 jours</div>
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-2.5 h-2.5 mr-1" />
            Tontine famille
          </div>
        </div>

        <div className="bg-white border p-3" style={{borderRadius: '4px'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Rendement</span>
            <TrendingUp className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">12.5%</div>
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 bg-white">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Rechercher une tontine..." 
                    className="pl-10"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[160px] justify-start">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem checked>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      En cours
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Planifiée
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex flex-wrap gap-2 min-w-0">
                  <Badge className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Active
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-emerald-200" />
                  </Badge>
                  <Badge className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500">
                    <Users className="w-3 h-3" />
                    Créateur
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-200" />
                  </Badge>
                  <Badge className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white border-amber-500">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    En cours
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-amber-200" />
                  </Badge>
                  <Badge className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white border-purple-500">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Planifiée
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-purple-200" />
                  </Badge>
                </div>
                
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {/* Tontine Item */}
              <div 
                className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer" 
                onClick={() => window.location.href = '/tontines/famille'}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                      <Users className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 font-poppins">Tontine Famille</h4>
                      <p className="text-xs text-gray-500">85 000 FCFA</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-0.5">
                    En cours
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Dans 5 jours
                  <span className="mx-2">•</span>
                  <Users className="w-3 h-3 mr-1" />
                  12 participants
                </div>
              </div>

              {/* More Tontine Items */}
              <div 
                className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => window.location.href = '/tontines/epargne-projet'}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <DollarSign className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 font-poppins">Épargne Projet</h4>
                      <p className="text-xs text-gray-500">120 000 FCFA</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-0.5">
                    Terminée
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Il y a 3 jours
                  <span className="mx-2">•</span>
                  <Users className="w-3 h-3 mr-1" />
                  8 participants
                </div>
              </div>
              
              <div 
                className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => window.location.href = '/tontines/business'}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 font-poppins">Tontine Business</h4>
                      <p className="text-xs text-gray-500">25 000 FCFA</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5">
                    À venir
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  Dans 3 jours
                  <span className="mx-2">•</span>
                  <Users className="w-3 h-3 mr-1" />
                  6 participants
                </div>
              </div>
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
            <Tabs defaultValue="gains" className="w-full">
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
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-300 px-4">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-900">Tontine Famille</div>
                      <div className="text-xs text-green-700">Tour 3 - Dans 2 jours</div>
                      <div className="text-xs text-green-600 font-medium">85 000 FCFA</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-300 px-4">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-900">Épargne Projet</div>
                      <div className="text-xs text-green-700">Tour 8 - Dans 12 jours</div>
                      <div className="text-xs text-green-600 font-medium">120 000 FCFA</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contributions" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-300 px-4">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900">Tontine Business</div>
                      <div className="text-xs text-blue-700">Tour 2 - Demain</div>
                      <div className="text-xs text-blue-600 font-medium">25 000 FCFA</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-300 px-4">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900">Épargne Projet</div>
                      <div className="text-xs text-blue-700">Tour 5 - Dans 5 jours</div>
                      <div className="text-xs text-blue-600 font-medium">15 000 FCFA</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-300 px-4">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900">Tontine Famille</div>
                      <div className="text-xs text-blue-700">Tour 4 - Dans 9 jours</div>
                      <div className="text-xs text-blue-600 font-medium">10 000 FCFA</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Créer une tontine
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Inviter des amis
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}