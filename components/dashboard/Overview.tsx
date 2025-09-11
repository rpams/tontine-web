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

export default function Overview() {
  const [activeTab, setActiveTab] = useState("gains");

  // Données complètes pour les sheets
  const allGains = [
    { name: "Tontine Famille", tour: 3, date: "Dans 2 jours", amount: "85 000 FCFA", status: "confirmed" },
    { name: "Épargne Projet", tour: 8, date: "Dans 12 jours", amount: "120 000 FCFA", status: "confirmed" },
    { name: "Business Fund", tour: 5, date: "Dans 18 jours", amount: "45 000 FCFA", status: "pending" },
    { name: "Tontine Amis", tour: 2, date: "Dans 25 jours", amount: "30 000 FCFA", status: "pending" },
    { name: "Épargne Voyage", tour: 7, date: "Dans 30 jours", amount: "75 000 FCFA", status: "confirmed" },
  ];

  const allContributions = [
    { name: "Tontine Business", tour: 2, date: "Demain", amount: "25 000 FCFA", status: "pending" },
    { name: "Épargne Projet", tour: 5, date: "Dans 5 jours", amount: "15 000 FCFA", status: "confirmed" },
    { name: "Tontine Famille", tour: 4, date: "Dans 9 jours", amount: "10 000 FCFA", status: "confirmed" },
    { name: "Business Fund", tour: 6, date: "Dans 14 jours", amount: "20 000 FCFA", status: "pending" },
    { name: "Tontine Amis", tour: 3, date: "Dans 21 jours", amount: "12 000 FCFA", status: "confirmed" },
    { name: "Épargne Voyage", tour: 8, date: "Dans 28 jours", amount: "18 000 FCFA", status: "pending" },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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
              <div className="flex items-center gap-3">
                <div className="relative flex-1 bg-white">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Rechercher une tontine..." 
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
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-2 flex-1">
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
                
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 p-1 h-auto">
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