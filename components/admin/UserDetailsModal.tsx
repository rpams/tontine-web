"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  TrendingUp,
  TrendingDown,
  BadgeCheck,
  Eye,
  Download
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

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div>No user data available</div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mock data - à remplacer par de vraies données
  const userDetails = {
    fullName: user.name,
    email: user.email,
    phone: user.phone || "+225 07 12 34 56 78",
    address: "Abidjan, Cocody",
    birthDate: "15 Mars 1990",
    profession: "Entrepreneur",
    registrationDate: user.joinDate,
  };

  const userDocuments = [
    { id: 1, name: "Carte d'identité", type: "ID", status: "verified", uploadDate: "12 Jan 2024", url: "#" },
    { id: 2, name: "Justificatif de revenus", type: "INCOME", status: "verified", uploadDate: "15 Jan 2024", url: "#" },
    { id: 3, name: "Photo de profil", type: "PHOTO", status: "pending", uploadDate: "20 Jan 2024", url: "#" },
  ];

  const userTontines = [
    { id: 1, name: "Tontine Famille", role: "Créateur", participants: 12, amount: "85,000 FCFA", status: "active", joinDate: "15 Mars 2024" },
    { id: 2, name: "Épargne Projet", role: "Participant", participants: 8, amount: "50,000 FCFA", status: "active", joinDate: "20 Mars 2024" },
    { id: 3, name: "Business Fund", role: "Participant", participants: 6, amount: "25,000 FCFA", status: "completed", joinDate: "10 Février 2024" },
  ];

  const userTours = [
    { id: 1, tontine: "Tontine Famille", month: "Avril 2024", amount: "85,000 FCFA", status: "received", date: "30 Avril 2024", position: 1 },
    { id: 2, tontine: "Épargne Projet", month: "Mai 2024", amount: "50,000 FCFA", status: "upcoming", date: "31 Mai 2024", position: 3 },
    { id: 3, tontine: "Business Fund", month: "Mars 2024", amount: "25,000 FCFA", status: "completed", date: "31 Mars 2024", position: 2 },
  ];

  const userPayments = [
    { id: 1, type: "Contribution", tontine: "Tontine Famille", amount: "85,000 FCFA", status: "completed", date: "01 Avril 2024", reference: "TF240401001" },
    { id: 2, type: "Gain", tontine: "Business Fund", amount: "25,000 FCFA", status: "completed", date: "31 Mars 2024", reference: "BF240331002" },
    { id: 3, type: "Contribution", tontine: "Épargne Projet", amount: "50,000 FCFA", status: "pending", date: "15 Avril 2024", reference: "EP240415003" },
    { id: 4, type: "Contribution", tontine: "Tontine Famille", amount: "85,000 FCFA", status: "failed", date: "28 Mars 2024", reference: "TF240328004" },
  ];

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

  const getPaymentTypeConfig = (type: string) => {
    switch (type) {
      case 'Contribution':
        return { color: 'text-red-600', icon: TrendingDown, prefix: '-' };
      case 'Gain':
        return { color: 'text-green-600', icon: TrendingUp, prefix: '+' };
      default:
        return { color: 'text-gray-600', icon: DollarSign, prefix: '' };
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
                  { label: 'Nom complet', value: userDetails.fullName },
                  { label: 'Email', value: userDetails.email },
                  { label: 'Téléphone', value: userDetails.phone },
                  { label: 'Adresse', value: userDetails.address },
                  { label: 'Date de naissance', value: userDetails.birthDate },
                  { label: 'Profession', value: userDetails.profession }
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
                  <Badge variant={user.isEmailVerified ? 'default' : 'secondary'} className="text-xs h-4 sm:h-5 px-1.5 sm:px-2 self-start sm:self-auto">
                    {user.isEmailVerified ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">Documents vérifiés</span>
                  <Badge variant={user.isDocumentVerified ? 'default' : 'secondary'} className="text-xs h-4 sm:h-5 px-1.5 sm:px-2 self-start sm:self-auto">
                    {user.isDocumentVerified ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">Statut</span>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs h-4 sm:h-5 px-1.5 sm:px-2 self-start sm:self-auto">
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium sm:font-normal">Inscrit le</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{userDetails.registrationDate}</span>
                </div>

                {/* Document d'identité */}
                <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center flex-shrink-0 ${getStatusConfig(userDocuments[0].status).color}`}>
                      <FileText className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{userDocuments[0].name}</p>
                      <p className="text-xs text-gray-500">Ajouté le {userDocuments[0].uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2 flex-shrink-0">
                    <Badge variant="secondary" className={`${getStatusConfig(userDocuments[0].status).color} text-xs border-0 h-4 px-1.5`}>
                      {userDocuments[0].status === 'verified' ? 'Vérifié' : userDocuments[0].status === 'pending' ? 'En attente' : 'Rejeté'}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>


          {/* Onglet Tontines */}
          <TabsContent value="tontines" className="flex-1 overflow-y-auto mt-2 sm:mt-3 md:mt-4">
            <div className="space-y-2">
              {userTontines.map((tontine) => {
                const statusConfig = getStatusConfig(tontine.status);

                return (
                  <div key={tontine.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center flex-shrink-0">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{tontine.name}</p>
                          {tontine.role === 'Créateur' && (
                            <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{tontine.participants} participants • {tontine.amount}</p>
                        <p className="text-xs text-gray-400">Rejoint le {tontine.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-1 flex-shrink-0">
                      <Badge variant="outline" className="text-xs h-4 px-1.5">
                        {tontine.role}
                      </Badge>
                      <Badge variant="secondary" className={`${statusConfig.color} text-xs border-0 h-4 px-1.5`}>
                        {tontine.status === 'active' ? 'Active' : 'Terminée'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Onglet Tours */}
          <TabsContent value="tours" className="flex-1 overflow-y-auto mt-2 sm:mt-3 md:mt-4">
            <div className="space-y-2">
              {userTours.map((tour) => {
                const statusConfig = getStatusConfig(tour.status);

                return (
                  <div key={tour.id} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 rounded-lg border border-gray-200 gap-2 sm:gap-3 ${
                    tour.status === 'upcoming' ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        tour.status === 'received' ? 'bg-green-100 text-green-600' :
                        tour.status === 'upcoming' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {tour.position === 1 ? <Crown className="w-3 h-3" /> : tour.position}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{tour.tontine}</p>
                        <p className="text-xs text-gray-500">{tour.month} • Position #{tour.position}</p>
                        <p className="text-xs text-gray-400">{tour.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-1 flex-shrink-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 sm:mb-1">{tour.amount}</p>
                      <Badge variant="secondary" className={`${statusConfig.color} text-xs border-0 h-4 px-1.5`}>
                        {tour.status === 'received' ? 'Reçu' : tour.status === 'upcoming' ? 'À venir' : 'Terminé'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Onglet Paiements */}
          <TabsContent value="payments" className="flex-1 overflow-y-auto mt-2 sm:mt-3 md:mt-4">
            <div className="space-y-2">
              {userPayments.map((payment) => {
                const statusConfig = getStatusConfig(payment.status);
                const typeConfig = getPaymentTypeConfig(payment.type);
                const StatusIcon = statusConfig.icon;
                const TypeIcon = typeConfig.icon;

                return (
                  <div key={payment.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center flex-shrink-0 ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{payment.tontine}</h3>
                          <Badge variant="secondary" className={`${statusConfig.color} text-xs border-0 h-4 px-1.5 self-start sm:self-auto mt-1 sm:mt-0`}>
                            {payment.status === 'completed' ? 'Terminé' : payment.status === 'pending' ? 'En attente' : 'Échec'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate">Réf: {payment.reference}</p>
                        <p className="text-xs text-gray-400">{payment.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-1 flex-shrink-0">
                      <div className={`flex items-center font-semibold text-xs sm:text-sm ${typeConfig.color}`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        <span>{typeConfig.prefix}{payment.amount}</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-4 px-1.5">
                        {payment.type}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}