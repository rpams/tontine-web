"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarChart3,
  Users,
  CreditCard,
  User,
  BadgeCheck,
  Shield,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight
} from "lucide-react";
import Overview from "@/components/dashboard/Overview";
import Profile from "@/components/dashboard/Profile";
import Tontines from "@/components/dashboard/Tontines";
import Payments from "@/components/dashboard/Payments";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";
import { Separator } from "@radix-ui/react-separator";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [identityVerificationStatus, setIdentityVerificationStatus] = useState<'not_started' | 'pending' | 'verified' | 'rejected'>('not_started');

  // Récupérer les données utilisateur depuis le store
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin,
    isModerator,
    needsProfileCompletion
  } = useAuth();

  // Rediriger vers complete-profile si le profil n'est pas complet
  useEffect(() => {
    if (needsProfileCompletion) {
      window.location.href = "/complete-profile";
    }
  }, [needsProfileCompletion]);

  // Données utilisateur dérivées du store
  const userName = profile?.showUsernameByDefault && profile?.username
    ? profile.username
    : `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || user?.name || 'Utilisateur';

  const userEmail = user?.email || '';
  const userAvatar = profile?.avatarUrl || profile?.profileImageUrl || "/avatars/avatar-portrait-svgrepo-com.svg";

  const userVerification = {
    isEmailVerified: user?.emailVerified || false,
    isDocumentVerified: false // TODO: À implémenter avec la vérification d'identité
  };

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      <NavbarDashboard
        userAvatar={userAvatar}
        userName="Jean Dupont"
        userEmail="jean.dupont@email.com"
        userVerification={userVerification}
      />


      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* User Info Block */}
        <div className="bg-white border p-3 rounded-lg mb-4 max-w-full sm:max-w-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-green-500 bg-green-50 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <img 
                  src={userAvatar} 
                  alt="Jean Dupont"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-medium text-gray-900 font-poppins truncate text-sm">Jean Dupont</h3>
                {userVerification.isEmailVerified && userVerification.isDocumentVerified && (
                  <BadgeCheck className="w-3 h-3 text-blue-600 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-gray-400 mr-1">@</span>
                <span className="truncate">jean.dupont@email.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Identity Verification Section */}
        {identityVerificationStatus !== 'verified' && (
          <div className="bg-white border rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  identityVerificationStatus === 'not_started' ? 'bg-blue-50' :
                  identityVerificationStatus === 'pending' ? 'bg-yellow-50' :
                  identityVerificationStatus === 'rejected' ? 'bg-red-50' : 'bg-green-50'
                }`}>
                  {identityVerificationStatus === 'not_started' && <Shield className="w-5 h-5 text-blue-600" />}
                  {identityVerificationStatus === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                  {identityVerificationStatus === 'rejected' && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {identityVerificationStatus === 'not_started' && 'Vérification d\'identité recommandée'}
                      {identityVerificationStatus === 'pending' && 'Vérification d\'identité en cours'}
                      {identityVerificationStatus === 'rejected' && 'Vérification d\'identité requise'}
                    </h3>
                    <Badge variant="outline" className={`text-xs ${
                      identityVerificationStatus === 'not_started' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      identityVerificationStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {identityVerificationStatus === 'not_started' && 'Optionnel'}
                      {identityVerificationStatus === 'pending' && 'En attente'}
                      {identityVerificationStatus === 'rejected' && 'Action requise'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {identityVerificationStatus === 'not_started' && 'Augmentez vos limites de transaction et renforcez la sécurité de votre compte.'}
                    {identityVerificationStatus === 'pending' && 'Votre demande est en cours de traitement. Nous vous contacterons sous 24-48h.'}
                    {identityVerificationStatus === 'rejected' && 'Votre vérification a été rejetée. Veuillez soumettre de nouveaux documents.'}
                  </p>
                  {identityVerificationStatus === 'not_started' && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>✓ Limites augmentées</span>
                      <span>✓ Sécurité renforcée</span>
                      <span>✓ Accès complet</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {identityVerificationStatus === 'not_started' && (
                  <Link href="/identity-verification">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Shield className="w-4 h-4 mr-2" />
                      Commencer la vérification
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
                {identityVerificationStatus === 'pending' && (
                  <Button variant="outline" disabled>
                    <Clock className="w-4 h-4 mr-2" />
                    En cours de traitement
                  </Button>
                )}
                {identityVerificationStatus === 'rejected' && (
                  <Link href="/identity-verification">
                    <Button variant="destructive">
                      <Shield className="w-4 h-4 mr-2" />
                      Renouveler la vérification
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-1 bg-white border rounded-lg p-1 overflow-x-auto scrollbar-hide">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className="flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              <Button
                variant={activeTab === "tontines" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("tontines")}
                className="flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Tontines
              </Button>
              <Button
                variant={activeTab === "payments" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("payments")}
                className="flex items-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Paiements
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("profile")}
                className="flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Profil
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                12hrs temps économisé
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                ✓ 24 tontines terminées
              </Badge>
              <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                ⏳ 7 tontines en cours
              </Badge>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tableau de bord</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>



        {/* Tab Content */}
        {activeTab === "overview" && <Overview />}
        {activeTab === "profile" && <Profile onAvatarChange={setUserAvatar} currentAvatar={userAvatar} />}
        {activeTab === "tontines" && <Tontines />}
        {activeTab === "payments" && <Payments />}
      </main>
    </div>
  );
}