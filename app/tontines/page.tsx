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
    <div className="min-h-screen bg-stone-50/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
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
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
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
                  <DialogContent className="w-[95vw] max-w-md mx-auto bg-white border-2 border-blue-100 shadow-xl">
                  {!isSuccess ? (
                    <>
                      <DialogHeader className="pb-3 sm:pb-4">
                        <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 font-poppins text-left mb-3 sm:mb-4">
                          Rejoindre une tontine
                        </DialogTitle>
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                            <Key className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base text-left">Code d'invitation requis</h3>
                            <p className="text-xs sm:text-sm text-gray-600 text-left">
                              Entrez le code d'invitation que vous avez reçu pour rejoindre la tontine
                            </p>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="space-y-3 sm:space-y-4 py-1 sm:py-2">
                        <div>
                          <div className="relative">
                            <Input
                              placeholder="Ex: FAMILLE2024"
                              value={inviteCode}
                              onChange={(e) => {
                                setInviteCode(e.target.value);
                                setError("");
                              }}
                              onKeyPress={handleKeyPress}
                              className={`text-center font-mono text-base sm:text-lg tracking-wider uppercase bg-white/70 border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 h-11 sm:h-12 ${
                                error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-blue-200 focus:border-blue-400"
                              }`}
                              maxLength={20}
                              autoFocus={false}
                              onBlur={isLoading ? (e) => e.target.blur() : undefined}
                              disabled={isLoading}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-md pointer-events-none"></div>
                          </div>
                          {error && (
                            <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 rounded-lg shadow-sm">
                              <div className="flex items-start">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <p className="text-xs sm:text-sm text-red-700 font-medium leading-tight">{error}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-center pt-2 sm:pt-2">
                        <Button
                          onClick={handleVerifyCode}
                          disabled={!inviteCode || isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-white font-medium h-11 sm:h-12"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              <span className="text-sm sm:text-base">Vérification...</span>
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span className="text-sm sm:text-base">Vérifier le code</span>
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <>
                      <DialogHeader className="pb-3 sm:pb-4">
                        <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 font-poppins text-left mb-3 sm:mb-4">
                          Tontine trouvée !
                        </DialogTitle>
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-green-900 mb-1 text-sm sm:text-base text-left">Code validé avec succès</h3>
                            <p className="text-xs sm:text-sm text-gray-600 text-left">
                              Vous pouvez maintenant rejoindre cette tontine
                            </p>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="py-1 sm:py-2">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <h4 className="font-semibold text-green-900 font-poppins text-sm sm:text-base truncate pr-2">{tontineDetails?.name}</h4>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div className="flex items-center text-green-700">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-md flex items-center justify-center mr-2 flex-shrink-0">
                                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium">{tontineDetails?.participants}</span>
                                <span className="ml-1">participants</span>
                              </div>
                            </div>
                            <div className="flex items-center text-green-700">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-md flex items-center justify-center mr-2 flex-shrink-0">
                                <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium truncate">{tontineDetails?.amount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={resetDialog}
                          className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 text-sm sm:text-base h-10 sm:h-11"
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handleJoinTontine}
                          className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-white font-medium text-sm sm:text-base h-10 sm:h-11"
                        >
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span>Rejoindre maintenant</span>
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
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
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