"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTontine } from "@/lib/hooks/useTontines";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowUpRight,
  TrendingUp,
  Crown,
  Share2
} from "lucide-react";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";

export default function TontineDetail() {
  const params = useParams();
  const router = useRouter();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const tontineId = params.id as string;
  const { data, isLoading, error } = useTontine(tontineId);
  const tontine = data?.tontine;

  // Helper functions
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'En cours';
      case 'completed': return 'Terminée';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
        <NavbarDashboard />
        <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
          {/* Navigation skeleton */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
              <Button variant="ghost" size="sm" className="text-sm" disabled>
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Retour au dashboard</span>
                <span className="sm:hidden">Retour</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Tableau de bord</span>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-500">Tontines</span>
              <span className="text-gray-400">/</span>
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Header skeleton */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-gray-500">
                    <Skeleton className="h-3 w-32" />
                    <span className="hidden sm:inline">•</span>
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                <Skeleton className="h-6 w-16" />
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Skeleton className="w-7 h-7 sm:w-auto sm:h-auto sm:px-4 sm:py-2" />
                  <Skeleton className="w-7 h-7 sm:w-auto sm:h-auto sm:px-4 sm:py-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { icon: DollarSign, label: "Montant par tour" },
              { icon: Users, label: "Participants" },
              { icon: CheckCircle, label: "Tours complétés" },
              { icon: Clock, label: "Prochain tour" }
            ].map((stat, index) => (
              <div key={index} className="bg-white border p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">{stat.label}</span>
                  <stat.icon className="h-3 w-3 text-gray-400" />
                </div>
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>

          {/* Main content skeleton */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 lg:flex-[2]">
              {/* Tabs skeleton */}
              <div className="w-full">
                <div className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 sm:p-1 border p-2 bg-white rounded-lg mb-6">
                  {[
                    { icon: Trophy, label: "Tours" },
                    { icon: Users, label: "Participants" },
                    { icon: Crown, label: "Ordre" },
                    { icon: History, label: "Historique" }
                  ].map((tab, index) => (
                    <div key={index} className="flex-col sm:flex-row p-2 sm:p-3 h-auto sm:h-10 sm:rounded-md flex items-center justify-center">
                      <tab.icon className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0 text-gray-400" />
                      <span className="text-xs sm:text-sm sm:font-medium text-gray-500">{tab.label}</span>
                    </div>
                  ))}
                </div>

                {/* Content skeleton */}
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Skeleton className="w-8 h-8 rounded-lg" />
                          <div className="min-w-0 flex-1">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-48 mb-1" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-5 w-20 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column skeleton */}
            <div className="flex-1 space-y-6">
              {/* Prochain gagnant skeleton */}
              <div className="hidden lg:block space-y-3">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-medium text-amber-800">Prochain gagnant</h3>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment section skeleton */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Effectuer un paiement</h3>
                <div className="bg-white border rounded-lg p-3 sm:p-4">
                  <Button className="w-full mb-3" size="lg" disabled>
                    <Coins className="w-5 h-5 mr-2" />
                    Effectuer un paiement
                  </Button>
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-600 mb-2">Moyens de paiement acceptés :</p>
                    <div className="flex items-center justify-start space-x-3 opacity-50">
                      <div className="h-6 w-14 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-9 w-10 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-9 w-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !tontine) {
    return (
      <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
        <NavbarDashboard />
        <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tontine non trouvée</h2>
            <p className="text-gray-600 mb-4">La tontine que vous recherchez n'existe pas ou vous n'y avez pas accès.</p>
            <Button onClick={() => router.push('/dashboard')}>Retour au dashboard</Button>
          </div>
        </main>
      </div>
    );
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/tontines?code=${tontine.inviteCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: tontine.name,
          text: `Rejoignez ma tontine ${tontine.name} !`,
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
      <NavbarDashboard />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => router.push('/dashboard')}>
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
                <BreadcrumbPage>{tontine.name}</BreadcrumbPage>
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
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins truncate">{tontine.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-gray-500">
                  <span>Créée le {formatDate(tontine.createdAt)}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{tontine.participantCount} participants</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
              <Badge variant="secondary" className={`${getStatusColor(tontine.status)} text-xs`}>
                {getStatusText(tontine.status)}
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
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">{formatAmount(tontine.amountPerRound)}</div>
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
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">{tontine.participantCount}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Users className="w-2.5 h-2.5 mr-1" />
              {tontine.maxParticipants && tontine.participantCount >= tontine.maxParticipants ? 'Groupe complet' : `${tontine.maxParticipants || 'Illimité'} max`}
            </div>
          </div>

          <div className="bg-white border p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Tours complétés</span>
              <CheckCircle className="h-3 w-3 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">{tontine.completedRounds}/{tontine.totalRounds}</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="w-2.5 h-2.5 mr-1" />
              {tontine.completionPercentage}% complété
            </div>
          </div>

          <div className="bg-white border p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Prochain tour</span>
              <Clock className="h-3 w-3 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 mb-0.5 font-poppins">{tontine.nextRound ? `${tontine.nextRound.daysUntil} jours` : 'Aucun'}</div>
            <div className="flex items-center text-xs text-orange-600">
              <Calendar className="w-2.5 h-2.5 mr-1" />
              {tontine.nextRound ? formatDate(tontine.nextRound.dueDate) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Prochain gagnant - Mobile/Tablet uniquement */}
        {tontine.nextRound && tontine.nextRound.winner && (
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
                    <div className="font-semibold text-amber-900 text-sm">{tontine.nextRound.winner.name}</div>
                    <div className="text-xs text-amber-700">Tour {tontine.nextRound.roundNumber} • Dans {tontine.nextRound.daysUntil} jours</div>
                  </div>
                </div>
                <div className="relative text-left sm:text-right">
                  <div className="text-sm font-bold text-amber-800">{formatAmount(tontine.nextRound.expectedAmount)}</div>
                  <div className="text-xs text-amber-600">À recevoir</div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  {tontine.rounds
                    .sort((a, b) => b.roundNumber - a.roundNumber) // Sort by round number descending
                    .map((round) => {
                      const isNextRound = round.status === 'PENDING' || round.status === 'COLLECTING';
                      const isCompleted = round.status === 'COMPLETED';

                      return (
                        <div
                          key={round.id}
                          className={`p-3 rounded-lg border ${
                            isNextRound
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isNextRound
                                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                  : isCompleted
                                  ? 'w-7 h-7 bg-green-100'
                                  : 'w-7 h-7 bg-gray-100'
                              }`}>
                                {isNextRound ? (
                                  <Trophy className="w-4 h-4 text-white" />
                                ) : isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-600" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900 font-poppins">Tour {round.roundNumber}</h4>
                                  <Badge className={`text-xs px-2 py-0.5 ${
                                    isNextRound
                                      ? 'bg-blue-100 text-blue-800'
                                      : isCompleted
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {isNextRound ? 'À venir' : isCompleted ? 'Complété' : 'En attente'}
                                  </Badge>
                                </div>
                                {round.winner && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <Avatar className="h-5 w-5">
                                      {round.winner.avatarUrl ? (
                                        <AvatarImage src={round.winner.avatarUrl} />
                                      ) : (
                                        <AvatarFallback className={`text-xs ${
                                          isCompleted ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                          {getInitials(round.winner.name)}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <span className={`text-sm ${
                                      isNextRound ? 'text-blue-700 font-medium' : 'text-gray-700'
                                    }`}>
                                      {isNextRound ? 'Prochain tour •' : 'Gagnant:'} {round.winner.name}
                                    </span>
                                  </div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                                  <div className={`flex items-center ${
                                    isNextRound ? 'text-blue-600' : 'text-gray-600'
                                  }`}>
                                    <Calendar className="w-3 h-3 mr-1" />
                                    <span>
                                      {isNextRound
                                        ? `Dans ${round.daysUntil} jours (${formatDate(round.dueDate)})`
                                        : round.completedAt
                                        ? formatDate(round.completedAt)
                                        : formatDate(round.dueDate)
                                      }
                                    </span>
                                  </div>
                                  {isCompleted && (
                                    <div className="flex items-center text-green-600">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      <span>Paiements reçus: {round.paymentsReceived}/{round.totalParticipants}</span>
                                    </div>
                                  )}
                                  {isNextRound && (
                                    <div className="flex items-center text-gray-600">
                                      <Clock className="w-3 h-3 mr-1" />
                                      <span>Tirage automatique</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${
                                isNextRound ? 'text-blue-800' : 'text-gray-900'
                              }`}>
                                {formatAmount(round.expectedAmount)}
                              </div>
                              <div className={`text-xs ${
                                isNextRound ? 'text-blue-600' : 'text-gray-500'
                              }`}>
                                {isNextRound ? 'Montant du tour' : isCompleted ? 'Montant versé' : 'Montant attendu'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                  {tontine.rounds.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Aucun tour créé pour cette tontine</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="participants" className="mt-6">
                <div className="space-y-3">
                  {tontine.participants.map((participant) => {
                    const isOwner = participant.userId === tontine.creator.id;
                    const isCurrentUser = tontine.isOwner && isOwner; // Assuming current user is owner
                    const wonRounds = participant.wonRounds || [];

                    return (
                      <div
                        key={participant.id}
                        className={`p-2.5 sm:p-3 rounded-lg border ${
                          isOwner
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                          <div className="flex items-center space-x-2.5 sm:space-x-3">
                            <div className="relative">
                              <Avatar className={`flex-shrink-0 ${
                                isOwner ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-7 w-7 sm:h-8 sm:w-8'
                              }`}>
                                {participant.avatarUrl ? (
                                  <AvatarImage src={participant.avatarUrl} />
                                ) : (
                                  <AvatarFallback className={`font-semibold text-xs sm:text-sm ${
                                    isOwner ? 'bg-blue-100 text-blue-700' :
                                    wonRounds.length > 0 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {getInitials(participant.name)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              {isOwner && (
                                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                  <Crown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                    {participant.name}
                                  </h4>
                                  {isCurrentUser && (
                                    <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2">Vous</Badge>
                                  )}
                                  {wonRounds.length > 0 && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 sm:px-2 w-fit">
                                      Gagnant{wonRounds.length > 1 ? 's' : ''} T{wonRounds.map(r => r.roundNumber).join(',T')}
                                    </Badge>
                                  )}
                                </div>
                                <p className={`text-xs sm:text-sm ${
                                  isOwner ? 'text-blue-700' : 'text-gray-600'
                                }`}>
                                  {isOwner ? 'Créateur • ' : ''}{participant.paidPayments}/{participant.totalPayments} paiements
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {participant.isUpToDate ? (
                              <>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit hover:shadow-sm transition-all duration-300 animate-pulse">
                                  À jour ✨
                                </Badge>
                              </>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit">
                                En retard
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {tontine.participants.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Aucun participant dans cette tontine</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ordre" className="mt-6">
                <div className="space-y-3">
                  {tontine.rounds
                    .sort((a, b) => a.roundNumber - b.roundNumber) // Sort by round number ascending
                    .map((round) => {
                      const isNext = round.status === 'PENDING' || round.status === 'COLLECTING';
                      const isCompleted = round.status === 'COMPLETED';

                      return (
                        <div
                          key={round.id}
                          className={`rounded-lg p-3 shadow-sm ${
                            isNext
                              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isNext
                                  ? 'bg-gradient-to-br from-amber-400 to-amber-500'
                                  : isCompleted
                                  ? 'bg-green-100'
                                  : 'bg-gray-100'
                              }`}>
                                {isNext ? (
                                  <Crown className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <span className={`text-xs font-medium ${
                                    isCompleted ? 'text-green-600' : 'text-gray-600'
                                  }`}>
                                    {round.roundNumber}
                                  </span>
                                )}
                              </div>
                              {round.winner ? (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-7 w-7">
                                    {round.winner.avatarUrl ? (
                                      <AvatarImage src={round.winner.avatarUrl} />
                                    ) : (
                                      <AvatarFallback>{getInitials(round.winner.name)}</AvatarFallback>
                                    )}
                                  </Avatar>
                                  <div>
                                    <div className={`font-medium text-sm ${
                                      isNext ? 'text-amber-900' : 'text-gray-900'
                                    }`}>
                                      {round.winner.name}
                                    </div>
                                    <div className={`text-xs ${
                                      isNext ? 'text-amber-700' : 'text-gray-500'
                                    }`}>
                                      Tour {round.roundNumber} • {
                                        isNext
                                          ? `Dans ${round.daysUntil} jours`
                                          : isCompleted
                                          ? formatDate(round.completedAt || round.dueDate)
                                          : formatDate(round.dueDate)
                                      }
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium text-gray-900 text-sm">Aucun gagnant désigné</h4>
                                  <p className="text-xs text-gray-500">Tour {round.roundNumber} • {formatDate(round.dueDate)}</p>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`font-bold text-sm ${
                                isNext ? 'text-amber-800' : isCompleted ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {formatAmount(round.expectedAmount)}
                              </div>
                              <div className={`text-xs ${
                                isNext ? 'text-amber-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {isNext ? 'À recevoir' : isCompleted ? 'Versé' : 'En attente'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                  {tontine.rounds.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Crown className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Aucun ordre de gagnant défini</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="historique" className="mt-6">
                <div className="space-y-3">
                  {(() => {
                    // Generate history events from available data
                    const events = [];

                    // Add completed rounds
                    tontine.rounds
                      .filter(round => round.status === 'COMPLETED')
                      .forEach(round => {
                        events.push({
                          type: 'round_completed',
                          date: round.completedAt || round.dueDate,
                          title: `Tour ${round.roundNumber} terminé`,
                          description: `${round.winner?.name || 'Gagnant inconnu'} • ${formatAmount(round.expectedAmount)}`,
                          icon: Trophy,
                          color: 'green',
                          isRecent: false
                        });
                      });

                    // Add participant joins (using joinedAt from participants)
                    tontine.participants
                      .filter(p => p.userId !== tontine.creator.id) // Exclude creator
                      .forEach(participant => {
                        events.push({
                          type: 'participant_joined',
                          date: participant.joinedAt,
                          title: 'Nouveau participant',
                          description: `${participant.name} a rejoint`,
                          icon: Users,
                          color: 'purple',
                          isRecent: false
                        });
                      });

                    // Add tontine creation
                    events.push({
                      type: 'tontine_created',
                      date: tontine.createdAt,
                      title: 'Tontine créée',
                      description: `${tontine.creator.name} (créateur)`,
                      icon: Settings,
                      color: 'indigo',
                      isRecent: false
                    });

                    // Sort events by date (most recent first)
                    const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    // Mark the most recent event
                    if (sortedEvents.length > 0) {
                      sortedEvents[0].isRecent = true;
                    }

                    const getEventColors = (color: string, isRecent: boolean) => {
                      if (isRecent) {
                        return {
                          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                          border: 'border-2 border-green-200',
                          iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
                          iconText: 'text-white',
                          descColor: 'text-green-700'
                        };
                      }

                      const colorMap = {
                        green: {
                          bg: 'bg-white',
                          border: 'border border-gray-200',
                          iconBg: 'bg-green-100',
                          iconText: 'text-green-600',
                          descColor: 'text-gray-600'
                        },
                        blue: {
                          bg: 'bg-white',
                          border: 'border border-gray-200',
                          iconBg: 'bg-blue-100',
                          iconText: 'text-blue-600',
                          descColor: 'text-gray-600'
                        },
                        purple: {
                          bg: 'bg-white',
                          border: 'border border-gray-200',
                          iconBg: 'bg-purple-100',
                          iconText: 'text-purple-600',
                          descColor: 'text-gray-600'
                        },
                        indigo: {
                          bg: 'bg-white',
                          border: 'border border-gray-200',
                          iconBg: 'bg-indigo-100',
                          iconText: 'text-indigo-600',
                          descColor: 'text-gray-600'
                        }
                      };
                      return colorMap[color] || colorMap.blue;
                    };

                    return sortedEvents.map((event, index) => {
                      const colors = getEventColors(event.color, event.isRecent);
                      const Icon = event.icon;

                      return (
                        <div key={`${event.type}-${index}`} className={`${colors.bg} p-3 rounded-lg ${colors.border}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-${event.isRecent ? '8' : '7'} h-${event.isRecent ? '8' : '7'} ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-4 h-4 ${colors.iconText}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                  {event.isRecent && (
                                    <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">Récent</Badge>
                                  )}
                                </div>
                                <p className={`text-sm ${colors.descColor}`}>{event.description}</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()
                  }
                  {tontine.rounds.length === 0 && tontine.participants.length <= 1 && (
                    <div className="text-center py-8 text-gray-500">
                      <History className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Aucun historique disponible</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />

          {/* Right Column - Actions */}
          <div className="flex-1 space-y-6">
            {/* Prochain gagnant - Desktop uniquement */}
            {tontine.nextRound && tontine.nextRound.winner && (
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
                      <div className="font-semibold text-amber-900 text-sm">{tontine.nextRound.winner.name}</div>
                      <div className="text-xs text-amber-700">Tour {tontine.nextRound.roundNumber} • Dans {tontine.nextRound.daysUntil} jours</div>
                    </div>
                  </div>
                  <div className="relative text-left sm:text-right">
                    <div className="text-sm font-bold text-amber-800">{formatAmount(tontine.nextRound.expectedAmount)}</div>
                    <div className="text-xs text-amber-600">À recevoir</div>
                  </div>
                </div>
              </div>
            )}

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
                        <div className="text-xl font-bold text-blue-900">{formatAmount(tontine.amountPerRound)}</div>
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
                          <div className="font-medium text-gray-900 text-sm">{tontine.creator.name}</div>
                          <div className="text-xs text-gray-600">Échéance: {tontine.nextRound ? formatDate(tontine.nextRound.dueDate) : 'N/A'}</div>
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
          </div>
        </div>
      </main>
    </div>
  );
}