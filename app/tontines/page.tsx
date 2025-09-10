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
  ExternalLink
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
      if (inviteCode === "FAMILLE2024" || inviteCode === "BUSINESS123") {
        setIsSuccess(true);
        setTontineDetails({
          name: inviteCode === "FAMILLE2024" ? "Tontine Famille" : "Tontine Business",
          id: inviteCode === "FAMILLE2024" ? "famille" : "business",
          participants: inviteCode === "FAMILLE2024" ? 12 : 6,
          amount: inviteCode === "FAMILLE2024" ? "85 000 FCFA" : "25 000 FCFA"
        });
      } else {
        setError("Code d'invitation invalide. Vérifiez et réessayez.");
      }
      setIsLoading(false);
    }, 2000);
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
      <main className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="Tontine" className="h-8 w-auto" />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
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

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">Rejoindre une tontine</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Entrez le code d'invitation partagé par l'organisateur pour rejoindre une tontine existante
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg font-semibold">Code d'invitation requis</CardTitle>
              <CardDescription>
                Vous devez disposer d'un code d'invitation valide pour rejoindre une tontine
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full max-w-xs" size="lg">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Rejoindre une tontine
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
                              setError(""); // Clear error when typing
                            }}
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

          <div className="text-center text-sm text-gray-500">
            <p>
              Vous n'avez pas de code ? Demandez à l'organisateur de vous envoyer le lien d'invitation
            </p>
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