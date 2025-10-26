"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAdminUserDetails } from "@/lib/hooks/useAdmin";
import {
  User,
  FileText,
  Users,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Crown,
  BadgeCheck,
  Eye,
  Loader2
} from "lucide-react";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar: string;
    status: string;
    joinDate: string;
    isEmailVerified: boolean;
    isDocumentVerified: boolean;
  } | null;
}

export default function UserDetailsModal({ open, onOpenChange, user }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  // Récupérer les détails complets de l'utilisateur depuis l'API
  const { data: userDetailsData, isLoading } = useAdminUserDetails(user?.id || null);

  const userDetails = userDetailsData?.user;

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div>No user data available</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-4xl w-[95vw] flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Chargement des détails...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!userDetails) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div>Erreur lors du chargement des données</div>
        </DialogContent>
      </Dialog>
    );
  }

  // Combiner les tontines créées et participées
  const allTontines = [
    ...userDetails.ownedTontines,
    ...userDetails.participantTontines
  ].sort((a, b) => new Date(b.createdAt || b.joinedAt).getTime() - new Date(a.createdAt || a.joinedAt).getTime());

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
      case 'completed':
      case 'received':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, iconColor: 'text-green-500' };
      case 'pending':
      case 'upcoming':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, iconColor: 'text-yellow-500' };
      case 'failed':
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, iconColor: 'text-red-500' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle, iconColor: 'text-gray-500' };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl w-[95vw] h-[90vh] sm:h-[85vh] md:h-[90vh] overflow-hidden p-3 sm:p-4 md:p-6 flex flex-col">
        <DialogHeader className="relative pb-3 sm:pb-4 md:pb-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-start md:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-start text-gray-900 truncate">
                  {user.name}
                </DialogTitle>
                <p className="text-xs sm:text-sm md:text-base text-start text-gray-600 truncate">
                  Profil utilisateur • {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {user.isEmailVerified && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                  <BadgeCheck className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  <span className="hidden sm:inline">Vérifié</span>
                  <span className="sm:hidden">✓</span>
                </Badge>
              )}
              <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                {user.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 h-10 sm:h-11 flex-shrink-0 p-1">
            <TabsTrigger value="info" className="text-xs sm:text-sm px-1 sm:px-2 md:px-3 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1.5">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs">Info</span>
            </TabsTrigger>
            <TabsTrigger value="tontines" className="text-xs sm:text-sm px-1 sm:px-2 md:px-3 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1.5">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs">Tontines</span>
            </TabsTrigger>
            <TabsTrigger value="tours" className="text-xs sm:text-sm px-1 sm:px-2 md:px-3 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1.5">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs">Tours</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm px-1 sm:px-2 md:px-3 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1.5">
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs">Paiements</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Informations */}
          <TabsContent value="info" className="flex-1 overflow-y-auto mt-2 sm:mt-3 md:mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              {/* Informations personnelles */}
              <div className="space-y-2 sm:space-y-3">
                {[
                  { label: 'Nom complet', value: userDetails.name },
                  { label: 'Email', value: userDetails.email },
                  { label: 'Téléphone', value: userDetails.telephone || 'Non renseigné' },
                  { label: 'Adresse', value: userDetails.address || 'Non renseignée' },
                  { label: 'Date de naissance', value: userDetails.profile?.dateOfBirth ? new Date(userDetails.profile.dateOfBirth).toLocaleDateString('fr-FR') : 'Non renseignée' },
                  { label: 'Profession', value: userDetails.profile?.profession || 'Non renseignée' }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">{item.label}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 truncate sm:text-right" title={item.value}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Statut et Documents */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">Email vérifié</span>
                  <Badge variant={userDetails.verified ? 'default' : 'secondary'} className="text-xs h-4 sm:h-5 px-1.5 sm:px-2 self-start sm:self-auto">
                    {userDetails.verified ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">Documents vérifiés</span>
                  <Badge variant={userDetails.identityVerification?.status === 'APPROVED' ? 'default' : 'secondary'} className="text-xs h-4 sm:h-5 px-1.5 sm:px-2 self-start sm:self-auto">
                    {userDetails.identityVerification?.status === 'APPROVED' ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">Statut</span>
                  <Badge variant={userDetails.status === 'active' ? 'default' : 'secondary'} className="text-xs h-4 sm:h-5 px-1.5 sm:px-2 self-start sm:self-auto">
                    {userDetails.status === 'active' ? 'Actif' : 'Suspendu'}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">Inscrit le</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{new Date(userDetails.joinDate).toLocaleDateString('fr-FR')}</span>
                </div>

                {/* Document d'identité */}
                {userDetails.identityVerification && (
                  <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                        userDetails.identityVerification.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                        userDetails.identityVerification.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        <FileText className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{userDetails.identityVerification.documentType || "Document d'identité"}</p>
                        <p className="text-xs text-gray-500">Ajouté le {userDetails.identityVerification.submittedAt ? new Date(userDetails.identityVerification.submittedAt).toLocaleDateString('fr-FR') : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2 flex-shrink-0">
                      <Badge variant="secondary" className={`text-xs border-0 h-4 px-1.5 ${
                        userDetails.identityVerification.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        userDetails.identityVerification.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {userDetails.identityVerification.status === 'APPROVED' ? 'Vérifié' :
                         userDetails.identityVerification.status === 'PENDING' ? 'En attente' : 'Rejeté'}
                      </Badge>
                      {userDetails.identityVerification.documentFrontUrl && (
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => window.open(userDetails.identityVerification?.documentFrontUrl || '', '_blank')}>
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>


          {/* Onglet Tontines */}
          <TabsContent value="tontines" className="flex-1 overflow-y-auto mt-2 sm:mt-3 md:mt-4">
            <div className="space-y-2">
              {allTontines.length > 0 ? allTontines.map((tontine: any) => {
                const statusConfig = getStatusConfig(tontine.status.toLowerCase());

                return (
                  <div key={tontine.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center flex-shrink-0">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{tontine.name}</p>
                          {tontine.role === 'creator' && (
                            <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{tontine.participantCount || tontine.maxParticipants} participants • {tontine.amount} FCFA</p>
                        <p className="text-xs text-gray-400">
                          {tontine.role === 'creator' ? 'Créée le' : 'Rejoint le'} {new Date(tontine.createdAt || tontine.joinedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-1 flex-shrink-0">
                      <Badge variant="outline" className="text-xs h-4 px-1.5">
                        {tontine.role === 'creator' ? 'Créateur' : 'Participant'}
                      </Badge>
                      <Badge variant="secondary" className={`${statusConfig.color} text-xs border-0 h-4 px-1.5`}>
                        {tontine.status === 'ACTIVE' ? 'Active' :
                         tontine.status === 'PENDING' ? 'En attente' :
                         tontine.status === 'COMPLETED' ? 'Terminée' : tontine.status}
                      </Badge>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune tontine</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Onglet Tours */}
          <TabsContent value="tours" className="flex-1 overflow-y-auto mt-2 sm:mt-3 md:mt-4">
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-medium mb-1">Onglet Tours</p>
              <p className="text-xs">Les informations de tours seront disponibles prochainement</p>
            </div>
          </TabsContent>

          {/* Onglet Paiements */}
          <TabsContent value="payments" className="flex-1 overflow-y-auto mt-2 sm:mt-3 md:mt-4">
            <div className="space-y-2">
              {userDetails.payments.length > 0 ? userDetails.payments.map((payment: any) => {
                const statusConfig = getStatusConfig(payment.status.toLowerCase());
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={payment.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center flex-shrink-0 ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{payment.tontineName}</h3>
                          <Badge variant="secondary" className={`${statusConfig.color} text-xs border-0 h-4 px-1.5 self-start sm:self-auto mt-1 sm:mt-0`}>
                            {payment.status === 'COMPLETED' ? 'Terminé' :
                             payment.status === 'PENDING' ? 'En attente' :
                             payment.status === 'FAILED' ? 'Échec' : payment.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate">Réf: {payment.reference} • Round {payment.round}</p>
                        <p className="text-xs text-gray-400">
                          {payment.paidAt ? 'Payé le ' + new Date(payment.paidAt).toLocaleDateString('fr-FR') :
                           'Dû le ' + new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-1 flex-shrink-0">
                      <div className={`flex items-center font-semibold text-xs sm:text-sm ${
                        payment.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        <DollarSign className="w-3 h-3 mr-1" />
                        <span>{payment.amount} FCFA</span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun paiement</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}