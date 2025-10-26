"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Mail,
  BadgeCheck,
  Shield,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

function TontineContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tontineDetails, setTontineDetails] = useState<{
    id: string;
    name: string;
    participants: number;
    maxParticipants?: number;
    amount: string;
    description?: string;
    frequencyType?: string;
  } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      localStorage.removeItem('user-store');
      toast.success("Déconnexion réussie");
      router.push("/login");
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  // Gestion des liens d'invitation partagés
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      const normalizedCode = code.toUpperCase().trim();
      setInviteCode(normalizedCode);
      setIsDialogOpen(true);
      // Vérification automatique du code - passer le code directement
      setTimeout(() => {
        verifyCode(normalizedCode);
      }, 500);
    }
  }, [searchParams]);

  // Fonction de vérification qui accepte le code en paramètre
  const verifyCode = async (codeToVerify: string) => {
    if (!codeToVerify || codeToVerify.trim() === '') {
      setError("Code d'invitation requis");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/tontines/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: codeToVerify.toUpperCase().trim() })
      });

      const result = await response.json();

      if (result.success && result.tontine) {
        setIsSuccess(true);
        setTontineDetails({
          id: result.tontine.id,
          name: result.tontine.name,
          participants: result.tontine.participants,
          maxParticipants: result.tontine.maxParticipants,
          amount: `${result.tontine.amountPerRound.toLocaleString('fr-FR')} FCFA`,
          description: result.tontine.description,
          frequencyType: result.tontine.frequencyType,
        });
      } else {
        setError(result.error || "Code d'invitation invalide. Vérifiez et réessayez.");
      }
    } catch (error) {
      console.error("Erreur vérification code:", error);
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapper pour le bouton qui utilise le state inviteCode
  const handleVerifyCode = async () => {
    verifyCode(inviteCode);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inviteCode && !isLoading) {
      handleVerifyCode();
    }
  };

  const handleJoinTontine = async () => {
    if (!tontineDetails) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/tontines/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tontineId: tontineDetails.id })
      });

      const result = await response.json();

      if (result.success) {
        // Rediriger vers la page de détails de la tontine
        window.location.href = `/tontines/${tontineDetails.id}`;
      } else if (response.status === 401) {
        // Non authentifié - rediriger vers login
        const redirectUrl = encodeURIComponent(`/tontines?code=${inviteCode}`);
        window.location.href = `/login?redirect=${redirectUrl}`;
      } else {
        setError(result.error || "Impossible de rejoindre la tontine. Veuillez réessayer.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Erreur lors de la participation:", error);
      setError("Erreur de connexion. Veuillez réessayer.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
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
    <div
      className="min-h-screen bg-stone-50/90"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img
                src="/images/logo-text2.png"
                alt="Tontine"
                className="h-6 sm:h-8 w-auto"
              />
            </div>

            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all shadow-sm">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img
                          src={user.image || "/avatars/avatar-portrait-svgrepo-com.svg"}
                          alt="Avatar utilisateur"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      {user.emailVerified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="space-y-1">
                      {isAdmin && (
                        <>
                          <Link href="/admin">
                            <Button
                              variant="ghost"
                              className="w-full justify-start px-2 py-1.5 h-auto text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Administration</span>
                            </Button>
                          </Link>
                          <hr className="my-2" />
                        </>
                      )}
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-2 py-1.5 h-auto cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 py-1.5 h-auto cursor-pointer"
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 h-auto cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2 rotate-180" />
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
              <img
                src="/images/community.svg"
                alt="Community"
                className="w-full h-full"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins mb-2 sm:mb-3">
            Rejoindre une {" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                tontine
              </span>
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
              <CardTitle className="text-base sm:text-lg font-semibold">
                Code d'invitation requis
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Vous devez disposer d'un code d'invitation valide pour rejoindre
                une tontine
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                    size="lg"
                  >
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
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base text-left">
                              Code d'invitation requis
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 text-left">
                              Entrez le code d'invitation que vous avez reçu
                              pour rejoindre la tontine
                            </p>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="space-y-3 sm:space-y-4 py-1 sm:py-2">
                        <div>
                          <div className="relative">
                            <Input
                              placeholder="Ex: EDUZVS"
                              value={inviteCode}
                              onChange={(e) => {
                                setInviteCode(e.target.value);
                                setError("");
                              }}
                              onKeyDown={handleKeyPress}
                              className={`text-center font-mono text-base sm:text-lg tracking-wider uppercase bg-white/70 border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 h-11 sm:h-12 ${
                                error
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                  : "border-blue-200 focus:border-blue-400"
                              }`}
                              maxLength={6}
                              autoFocus={false}
                              onBlur={
                                isLoading ? (e) => e.target.blur() : undefined
                              }
                              disabled={isLoading}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-md pointer-events-none"></div>
                          </div>
                          {error && (
                            <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 rounded-lg shadow-sm">
                              <div className="flex items-start">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs font-bold">
                                    !
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-red-700 font-medium leading-tight">
                                  {error}
                                </p>
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
                              <span className="text-sm sm:text-base">
                                Vérification...
                              </span>
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span className="text-sm sm:text-base">
                                Vérifier le code
                              </span>
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
                            <h3 className="font-semibold text-green-900 mb-1 text-sm sm:text-base text-left">
                              Code validé avec succès
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 text-left">
                              Vous pouvez maintenant rejoindre cette tontine
                            </p>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="py-2 space-y-2">
                        {/* Nom de la tontine */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-green-600 font-medium">Tontine</p>
                              <h4 className="font-bold text-green-900 text-sm">{tontineDetails?.name}</h4>
                            </div>
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                              <Users className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-blue-600 font-medium">Participants</p>
                              <h4 className="font-bold text-blue-900 text-sm">
                                {tontineDetails?.participants}
                                {tontineDetails?.maxParticipants && ` / ${tontineDetails.maxParticipants}`} personnes
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* Montant */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-md flex items-center justify-center">
                              <DollarSign className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-purple-600 font-medium">Montant à cotiser</p>
                              <h4 className="font-bold text-purple-900 text-sm">{tontineDetails?.amount}</h4>
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
                          disabled={isLoading}
                          className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-white font-medium text-sm sm:text-base h-10 sm:h-11"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              <span>Inscription en cours...</span>
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span>Rejoindre maintenant</span>
                            </>
                          )}
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
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-2 py-1 h-auto"
              >
                <Mail className="w-3 h-3 mr-1" />
                Support
              </Button>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white/50 border border-gray-200/50 rounded-lg p-4 sm:p-6 mx-2 sm:mx-0 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
              Comment ça marche ?
            </h2>
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Recevez l'invitation
                </h3>
                <p className="text-sm text-gray-600">
                  Code ou lien d'invitation
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Rejoignez
                </h3>
                <p className="text-sm text-gray-600">
                  Confirmez votre participation
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Épargnez
                </h3>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50/90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <TontineContent />
    </Suspense>
  );
}
