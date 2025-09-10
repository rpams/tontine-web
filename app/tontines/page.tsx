"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Clock,
  Plus,
  CheckCircle,
  User,
  CreditCard,
  LogOut,
  Bell,
  UserPlus,
  Search,
  Key,
  ExternalLink,
  Mail
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function TontineContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tontineDetails, setTontineDetails] = useState(null);
  
  const searchParams = useSearchParams();
  
  // Gestion des liens d'invitation partagés
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setInviteCode(code);
      setIsDialogOpen(true);
      // Vérification automatique du code
      setTimeout(() => {
        handleVerifyCode();
      }, 1000);
    }
  }, [searchParams]);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError("");
    
    // Simulation de l'API call
    setTimeout(() => {
      const upperCode = inviteCode.toUpperCase().trim();
      if (upperCode === "FAMILLE2024" || upperCode === "BUSINESS123") {
        setIsSuccess(true);
        setTontineDetails({
          name: upperCode === "FAMILLE2024" ? "Tontine Famille" : "Tontine Business",
          id: upperCode === "FAMILLE2024" ? "famille" : "business",
          participants: upperCode === "FAMILLE2024" ? 12 : 6,
          amount: upperCode === "FAMILLE2024" ? "85 000 FCFA" : "25 000 FCFA"
        });
      } else {
        setError("Code d'invitation invalide. Vérifiez et réessayez.");
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inviteCode && !isLoading) {
      handleVerifyCode();
    }
  };

  const handleJoinTontine = () => {
    window.location.href = `/tontines/${tontineDetails.id}`;
  };

  const resetDialog = () => {
    setIsDialogOpen(false);
    setInviteCode("");
    setIsSuccess(false);
    setError("");
    setTontineDetails(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src="/images/logo.png" alt="Tontine" className="h-6 sm:h-8 w-auto" />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all border-2 border-blue-200 shadow-sm">
                  <AvatarImage src="/avatars/avatar-portrait-svgrepo-com.svg" alt="Avatar" />
                  <AvatarFallback className="bg-blue-50 text-blue-700 font-medium text-xs">JD</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Jean Dupont</p>
                <p className="text-xs leading-none text-muted-foreground">jean@example.com</p>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 h-auto">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 h-auto">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Paiements</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 h-auto">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1.5 h-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
              <img src="/images/community.svg" alt="Community" className="w-full h-full" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins mb-2 sm:mb-3">
            Rejoindre une {" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">tontine</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-sm -z-10"></div>
            </span>
            {/* <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">tontine</span> */}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-4">
            Entrez le code d'invitation pour rejoindre une tontine existante
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="mb-4 sm:mb-6 mx-2 sm:mx-0">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold">Code d'invitation requis</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Vous devez disposer d'un code d'invitation valide pour rejoindre une tontine
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200" size="lg">
                    <UserPlus className="w-5 h-5 mr-2" />
                    <span className="font-medium">Rejoindre une tontine</span>
                  </Button>
                </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                  {!isSuccess ? (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Key className="w-5 h-5 mr-2 text-blue-600" />
                          Code d'invitation
                        </DialogTitle>
                        <DialogDescription>
                          Entrez le code d'invitation que vous avez reçu
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Input
                            placeholder="Ex: FAMILLE2024"
                            value={inviteCode}
                            onChange={(e) => {
                              setInviteCode(e.target.value);
                              setError("");
                            }}
                            onKeyPress={handleKeyPress}
                            className={`text-center font-mono text-lg tracking-wider uppercase ${
                              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                            maxLength={20}
                          />
                          {error && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-red-500 rounded-full flex items-center justify-center mr-2">
                                  <span className="text-red-500 text-xs font-bold">!</span>
                                </div>
                                <p className="text-sm text-red-700">{error}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-center">
                        <Button 
                          onClick={handleVerifyCode} 
                          disabled={!inviteCode || isLoading}
                          className="w-full"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Vérification...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Vérifier le code
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Code valide !
                        </DialogTitle>
                        <DialogDescription>
                          Vous pouvez maintenant rejoindre cette tontine
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-green-900 mb-2 font-poppins">{tontineDetails?.name}</h3>
                              <div className="space-y-1.5">
                                <div className="flex items-center text-sm text-green-700">
                                  <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center mr-2.5">
                                    <Users className="w-3 h-3 text-green-600" />
                                  </div>
                                  <span className="font-medium">{tontineDetails?.participants}</span>
                                  <span className="ml-1">participants</span>
                                </div>
                                <div className="flex items-center text-sm text-green-700">
                                  <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center mr-2.5">
                                    <DollarSign className="w-3 h-3 text-green-600" />
                                  </div>
                                  <span className="font-medium">{tontineDetails?.amount}</span>
                                  <span className="ml-1">par tour</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center ml-4">
                              <Users className="w-7 h-7 text-green-600" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-center space-x-2">
                        <Button variant="outline" onClick={resetDialog}>
                          Annuler
                        </Button>
                        <Button onClick={handleJoinTontine} className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ouvrir
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 sm:p-4 mx-2 sm:mx-0 mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">
                  Pas de code ? Demandez le lien d'invitation à l'organisateur
                </p>
              </div>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-2 py-1 h-auto">
                <Mail className="w-3 h-3 mr-1" />
                Support
              </Button>
            </div>
          </div>

          {/* How it works */}
          <div className="max-w-3xl mx-auto px-2 sm:px-4">
            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Comment ça marche ?</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Recevez l'invitation</h3>
                <p className="text-sm text-gray-600">Code ou lien d'invitation</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Rejoignez</h3>
                <p className="text-sm text-gray-600">Confirmez votre participation</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Épargnez</h3>
                <p className="text-sm text-gray-600">Participez aux tours</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TontinesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50/90 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <TontineContent />
    </Suspense>
  );
}