"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Clock,
  ArrowLeft,
  Settings,
  Plus,
  Trophy,
  Coins,
  History,
  CheckCircle,
  XCircle,
  User,
  CreditCard,
  LogOut,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Crown,
  Share2
} from "lucide-react";

export default function TontineDetail() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/tontines?code=FAMILLE2024`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tontine Famille',
          text: 'Rejoignez ma tontine familiale !',
          url: shareUrl,
        });
        return;
      } catch (error) {
        console.log('Partage annulé ou échoué, fallback vers clipboard');
      }
    }

    // Fallback pour les navigateurs desktop
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Lien copié dans le presse-papier !');
      } else {
        // Fallback ultime pour les anciens navigateurs ou HTTP
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          alert('Lien copié dans le presse-papier !');
        } catch (err) {
          alert(`Impossible de copier automatiquement. Voici le lien à partager :\n\n${shareUrl}`);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      alert(`Voici le lien à partager :\n\n${shareUrl}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/images/logo.png" 
                alt="Logo Tontine" 
                className="w-16 h-12 sm:w-23 sm:h-16 object-contain"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all border-2 border-blue-200 shadow-sm">
                    <AvatarImage src="/avatars/avatar-portrait-svgrepo-com.svg" />
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-medium">JD</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-2"
                  align="end"
                >
                  <div className="space-y-1">
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Mon profil
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres
                      </Button>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle tontine
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Paiements
                      </Button>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
            <Button variant="ghost" size="sm" className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Retour au dashboard</span>
              <span className="sm:hidden">Retour</span>
            </Button>
          </div>
          
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Tableau de bord</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/tontines">Tontines</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tontine Famille</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Info */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins truncate">Tontine Famille</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-gray-500">
                  <span>Créée le 15 août 2024</span>
                  <span className="hidden sm:inline">•</span>
                  <span>12 participants</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                En cours
              </Badge>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-7 h-7 p-0 sm:w-auto sm:h-auto sm:p-2 cursor-pointer"
                  onClick={handleShare}
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline sm:ml-2">Partager</span>
                </Button>
                <Button variant="outline" size="sm" className="w-7 h-7 p-0 sm:w-auto sm:h-auto sm:p-2 cursor-pointer">
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline sm:ml-2">Paramètres</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Montant par tour</span>
              <DollarSign className="h-3 w-3 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">85 000 FCFA</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="w-2.5 h-2.5 mr-1" />
              Montant fixe
            </div>
          </div>

          <div className="bg-white border p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Participants</span>
              <Users className="h-3 w-3 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">12</div>
            <div className="flex items-center text-xs text-blue-600">
              <Users className="w-2.5 h-2.5 mr-1" />
              Groupe complet
            </div>
          </div>

          <div className="bg-white border p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Tours complétés</span>
              <CheckCircle className="h-3 w-3 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">3/12</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="w-2.5 h-2.5 mr-1" />
              25% complété
            </div>
          </div>

          <div className="bg-white border p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Prochain tour</span>
              <Clock className="h-3 w-3 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">2 jours</div>
            <div className="flex items-center text-xs text-orange-600">
              <Calendar className="w-2.5 h-2.5 mr-1" />
              12 Sept 2024
            </div>
          </div>
        </div>

        {/* Prochain gagnant - Mobile/Tablet uniquement */}
        <div className="lg:hidden mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-medium text-amber-800">Prochain gagnant</h3>
            </div>
            <div className="relative flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-100/20 rounded-lg"></div>
              <div className="relative flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="relative flex-1">
                  <div className="font-semibold text-amber-900 text-sm">Marie Dubois</div>
                  <div className="text-xs text-amber-700">Tour 4 • Dans 2 jours</div>
                </div>
              </div>
              <div className="relative text-left sm:text-right">
                <div className="text-sm font-bold text-amber-800">85 000 FCFA</div>
                <div className="text-xs text-amber-600">À recevoir</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:flex-[2]">
            <Tabs defaultValue="tours" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 sm:p-1 border p-2">
                <TabsTrigger value="tours" className="flex-col sm:flex-row p-2 sm:p-3 h-auto sm:h-10 sm:rounded-md">
                  <Trophy className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm sm:font-medium">Tours</span>
                </TabsTrigger>
                <TabsTrigger value="participants" className="flex-col sm:flex-row p-2 sm:p-3 h-auto sm:h-10 sm:rounded-md">
                  <Users className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm sm:font-medium">Participants</span>
                </TabsTrigger>
                <TabsTrigger value="ordre" className="flex-col sm:flex-row p-2 sm:p-3 h-auto sm:h-10 sm:rounded-md">
                  <Crown className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm sm:font-medium hidden sm:inline">Ordre des gagnants</span>
                  <span className="text-xs sm:hidden">Ordre</span>
                </TabsTrigger>
                <TabsTrigger value="historique" className="flex-col sm:flex-row p-2 sm:p-3 h-auto sm:h-10 sm:rounded-md">
                  <History className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm sm:font-medium">Historique</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tours" className="mt-6">
                <div className="space-y-3">
                  {/* Tour Item À Venir - Highlighted */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 font-poppins">Tour 4</h4>
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">À venir</Badge>
                          </div>
                          <p className="text-sm text-blue-700 font-medium mb-1">Prochain tour • Marie Dubois</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                            <div className="flex items-center text-blue-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>Dans 2 jours (12 Sept 2024)</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>Tirage automatique</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-800">85 000 FCFA</div>
                        <div className="text-xs text-blue-600">Montant du tour</div>
                      </div>
                    </div>
                  </div>

                  {/* Tours Complétés */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 font-poppins">Tour 3</h4>
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">Complété</Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs bg-green-50 text-green-700">MD</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700">Gagnant: Marie Dupont</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>5 Sept 2024</span>
                            </div>
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              <span>Paiements reçus: 12/12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">85 000 FCFA</div>
                        <div className="text-xs text-gray-500">Montant versé</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 font-poppins">Tour 2</h4>
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">Complété</Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs bg-green-50 text-green-700">JM</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700">Gagnant: Jean Martin</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>29 août 2024</span>
                            </div>
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              <span>Paiements reçus: 12/12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">85 000 FCFA</div>
                        <div className="text-xs text-gray-500">Montant versé</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="participants" className="mt-6">
                <div className="space-y-3">
                  {/* Participant Créateur - Highlighted */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 sm:p-3 rounded-lg border-2 border-blue-200">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                      <div className="flex items-center space-x-2.5 sm:space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm">JD</AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Crown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">John Doe</h4>
                              <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2">Vous</Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-blue-700">Créateur • 3/3 paiements</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit hover:shadow-sm transition-all duration-300 animate-pulse">À jour ✨</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Autres participants */}
                  <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-gray-200">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                      <div className="flex items-center space-x-2.5 sm:space-x-3">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                          <AvatarFallback className="bg-yellow-100 text-yellow-700 text-xs sm:text-sm">MD</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">Marie Dupont</h4>
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 sm:px-2 w-fit">Gagnante T3</Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">3/3 paiements</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit hover:shadow-sm transition-all duration-300 animate-pulse">À jour ✨</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-gray-200">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                      <div className="flex items-center space-x-2.5 sm:space-x-3">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                          <AvatarFallback className="bg-orange-100 text-orange-700 text-xs sm:text-sm">JM</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">Jean Martin</h4>
                              <Badge className="bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 sm:px-2 w-fit">Gagnant T2</Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">2/3 paiements</p>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit">En retard</Badge>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-gray-200">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                      <div className="flex items-center space-x-2.5 sm:space-x-3">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                          <AvatarFallback className="bg-gray-100 text-gray-700 text-xs sm:text-sm">SB</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">Sophie Bernard</h4>
                            <p className="text-xs sm:text-sm text-gray-600">3/3 paiements</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit hover:shadow-sm transition-all duration-300 animate-pulse">À jour ✨</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ordre" className="mt-6">
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                          <Crown className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback>MD</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-amber-900 text-sm">Marie Dubois</div>
                            <div className="text-xs text-amber-700">Tour 4 • Dans 2 jours</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-800 text-sm">85 000 FCFA</div>
                        <div className="text-xs text-amber-600">À recevoir</div>
                      </div>
                    </div>
                  </div>

                  {/* Prochains gagnants */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">5</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">Paul Martin</h4>
                          <p className="text-xs text-gray-500">Tour 5 • 26 Sept 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 text-sm">85 000 FCFA</div>
                        <div className="text-xs text-gray-500">En attente</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">6</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">Sophie Laurent</h4>
                          <p className="text-xs text-gray-500">Tour 6 • 10 Oct 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 text-sm">85 000 FCFA</div>
                        <div className="text-xs text-gray-500">En attente</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">7</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">Antoine Durand</h4>
                          <p className="text-xs text-gray-500">Tour 7 • 24 Oct 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 text-sm">85 000 FCFA</div>
                        <div className="text-xs text-gray-500">En attente</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="historique" className="mt-6">
                <div className="space-y-3">
                  {/* Événement Récent - Highlighted */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">Tour 3 terminé</h4>
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">Récent</Badge>
                          </div>
                          <p className="text-sm text-green-700">Marie Dupont • 85 000 FCFA</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">5 Sept</span>
                    </div>
                  </div>

                  {/* Autres événements */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Coins className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900">Paiement reçu</h4>
                          <p className="text-sm text-gray-600">Jean Martin • 85 000 FCFA</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">4 Sept</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900">Nouveau participant</h4>
                          <p className="text-sm text-gray-600">Sophie Bernard a rejoint</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">20 Août</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900">Tour 2 terminé</h4>
                          <p className="text-sm text-gray-600">Jean Martin • 85 000 FCFA</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">29 Août</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Settings className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900">Tontine créée</h4>
                          <p className="text-sm text-gray-600">John Doe (créateur)</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">15 Août</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />

          {/* Right Column - Actions */}
          <div className="flex-1 space-y-6">
            {/* Prochain gagnant - Desktop uniquement */}
            <div className="hidden lg:block space-y-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-medium text-amber-800">Prochain gagnant</h3>
              </div>
              <div className="relative flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-100/20 rounded-lg"></div>
                <div className="relative flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="relative flex-1">
                    <div className="font-semibold text-amber-900 text-sm">Marie Dubois</div>
                    <div className="text-xs text-amber-700">Tour 4 • Dans 2 jours</div>
                  </div>
                </div>
                <div className="relative text-left sm:text-right">
                  <div className="text-sm font-bold text-amber-800">85 000 FCFA</div>
                  <div className="text-xs text-amber-600">À recevoir</div>
                </div>
              </div>
            </div>

            {/* Bouton de paiement */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Effectuer un paiement</h3>
              <div className="bg-white border rounded-lg p-3 sm:p-4">
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-3" size="lg">
                      <Coins className="w-5 h-5 mr-2" />
                      Effectuer un paiement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md p-4">
                    {/* Header */}
                    <div className="text-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Coins className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-base font-semibold text-gray-900 mb-0.5">Effectuer un paiement</h2>
                      <p className="text-sm text-gray-600">Tour 4 • Tontine Famille</p>
                    </div>

                    {/* Montant */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-900">85 000 FCFA</div>
                        <div className="text-xs text-blue-700">Montant à payer</div>
                      </div>
                    </div>

                    {/* Informations utilisateur */}
                    <div className="bg-gray-50 rounded-lg p-2.5 mb-4 border">
                      <div className="flex items-center space-x-2.5">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">Jean Dupont</div>
                          <div className="text-xs text-gray-600">Échéance: 12 Sept 2024</div>
                        </div>
                      </div>
                    </div>

                    {/* Méthodes de paiement */}
                    <div className="space-y-2 mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Méthode de paiement</h3>
                      
                      <div 
                        className="flex items-center p-2.5 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                        onClick={() => {
                          console.log('Paiement KkiaPay');
                        }}
                      >
                        <img src="/images/kkiapay.png" alt="KkiaPay" className="h-5 w-auto mr-2.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">KkiaPay</div>
                          <div className="text-xs text-gray-600">Mobile Money, Cartes</div>
                        </div>
                        <div className="w-3 h-3 border-2 border-blue-400 rounded-full bg-blue-100"></div>
                      </div>
                      
                      <div 
                        className="flex items-center p-2.5 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
                        onClick={() => {
                          console.log('Paiement FedaPay');
                        }}
                      >
                        <img src="/images/fedapay.png" alt="FedaPay" className="h-5 w-auto mr-2.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">FedaPay</div>
                          <div className="text-xs text-gray-600">Mobile Money, Cartes</div>
                        </div>
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsPaymentDialogOpen(false)} 
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button className="flex-1">
                        Continuer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-600 mb-2">Moyens de paiement acceptés :</p>
                  <div className="flex items-center justify-start space-x-3">
                    <img src="/images/mtn.png" alt="MTN Money" className="h-6 w-14 object-contain" />
                    <img src="/images/moovmoney.png" alt="Moov Money" className="h-6 w-12 object-contain" />
                    <img src="/images/visa.svg" alt="Visa" className="h-9 w-10 object-contain" />
                    <img src="/images/mastercard.svg" alt="Mastercard" className="h-9 w-10 object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Inviter des participants
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  Lancer le tirage
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier la tontine
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}