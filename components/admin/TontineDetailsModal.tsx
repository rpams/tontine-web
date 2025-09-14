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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  User,
  Crown,
  ArrowRight,
  Edit,
  Save,
  X,
  GripVertical,
} from "lucide-react";
import { Label } from "../ui/label";

interface TontineDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tontine: {
    id: string;
    name: string;
    participants: number;
    amount: string;
    status: string;
    startDate: string;
    endDate: string;
    currentTour: number;
    totalTours: number;
  } | null;
}

export default function TontineDetailsModal({ open, onOpenChange, tontine }: TontineDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editableOrder, setEditableOrder] = useState<any[]>([]);

  if (!tontine) return null;

  // Initialize editable order when entering edit mode (exclude current winner - they're next and can't be changed)
  const startEditing = () => {
    const editableItems = winnersOrder.filter(winner => winner.status === 'upcoming');
    setEditableOrder(editableItems);
    setIsEditingOrder(true);
  };

  const saveOrder = () => {
    // Here you would save the new order to your backend
    console.log("New order:", editableOrder);
    setIsEditingOrder(false);
  };

  const cancelEditing = () => {
    setEditableOrder([]);
    setIsEditingOrder(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...editableOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setEditableOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === editableOrder.length - 1) return;
    const newOrder = [...editableOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setEditableOrder(newOrder);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newOrder = [...editableOrder];
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    setEditableOrder(newOrder);
  };

  // Mock data
  const tontineDetails = {
    description: "Tontine familiale pour les projets communs et l'entraide financière",
    frequency: "Mensuelle",
    contributionAmount: "85,000 FCFA",
    penalty: "5,000 FCFA",
    createdBy: "Jean Dupont",
    createdAt: "15 Mars 2024",
  };

  const participants = [
    { id: 1, name: "Jean Dupont", email: "jean@example.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "active", joinDate: "15 Mars 2024", position: 1 },
    { id: 2, name: "Marie Kone", email: "marie@example.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "active", joinDate: "16 Mars 2024", position: 2 },
    { id: 3, name: "Amadou Diallo", email: "amadou@example.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "active", joinDate: "18 Mars 2024", position: 3 },
    { id: 4, name: "Fatou Traore", email: "fatou@example.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "pending", joinDate: "20 Mars 2024", position: 4 },
    { id: 5, name: "Ibrahim Sidibe", email: "ibrahim.sidibe@email.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "active", joinDate: "22 Mars 2024", position: 5 },
    { id: 6, name: "Aissatou Ba", email: "aissatou.ba@gmail.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "active", joinDate: "25 Mars 2024", position: 6 },
    { id: 7, name: "Mamadou Camara", email: "mamadou.camara@outlook.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "active", joinDate: "28 Mars 2024", position: 7 },
    { id: 8, name: "Kadiatou Diallo", email: "kadiatou.diallo@hotmail.fr", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "active", joinDate: "30 Mars 2024", position: 8 },
    { id: 9, name: "Moussa Toure", email: "moussa.toure@yahoo.fr", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "pending", joinDate: "2 Avril 2024", position: 9 },
  ];

  const tours = [
    { id: 1, month: "Avril 2024", winner: "Jean Dupont", amount: "85,000 FCFA", status: "completed", date: "30 Avril 2024" },
    { id: 2, month: "Mai 2024", winner: "Marie Kone", amount: "85,000 FCFA", status: "completed", date: "31 Mai 2024" },
    { id: 3, month: "Juin 2024", winner: "Amadou Diallo", amount: "85,000 FCFA", status: "current", date: "30 Juin 2024" },
    { id: 4, month: "Juillet 2024", winner: "Fatou Traore", amount: "85,000 FCFA", status: "upcoming", date: "31 Juillet 2024" },
  ];

  const winnersOrder = [
    { position: 1, name: "Jean Dupont", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "completed" },
    { position: 2, name: "Marie Kone", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "completed" },
    { position: 3, name: "Amadou Diallo", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "current" },
    { position: 4, name: "Fatou Traore", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "upcoming" },
    { position: 5, name: "Ibrahim Sidibe", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "upcoming" },
    { position: 6, name: "Aissatou Ba", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "upcoming" },
    { position: 7, name: "Mamadou Camara", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "upcoming" },
    { position: 8, name: "Kadiatou Diallo", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "upcoming" },
    { position: 9, name: "Moussa Toure", avatar: "/avatars/avatar-portrait-svgrepo-com.svg", status: "upcoming" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl w-[95vw] max-h-[85vh] md:max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="relative pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-start text-gray-900">
                  {tontine.name}
                </DialogTitle>
                <p className="text-sm sm:text-base text-start text-gray-600">
                  {tontine.participants} participants • {tontine.amount}
                </p>
              </div>
            </div>
            <Badge variant={tontine.status === 'active' ? 'default' : 'secondary'} className="self-start sm:self-center">
              {tontine.status === 'active' ? 'Active' : 'En attente'}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-10 sm:h-11">
            <TabsTrigger value="details" className="text-xs sm:text-sm px-1 sm:px-3">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Détails</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="text-xs sm:text-sm px-1 sm:px-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Participants</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="tours" className="text-xs sm:text-sm px-1 sm:px-3">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Tours</span>
              <span className="sm:hidden">Tours</span>
            </TabsTrigger>
            <TabsTrigger value="winners" className="text-xs sm:text-sm px-1 sm:px-3">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Ordre</span>
              <span className="sm:hidden">Ordre</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Détails */}
          <TabsContent value="details" className="space-y-4 sm:space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Informations financières */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
                    <DollarSign className="w-3 h-3 text-green-600" />
                  </div>
                  <Label className="text-sm sm:text-base font-medium text-gray-900">Informations financières</Label>
                </div>
                <div className="bg-white border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Contribution:</span>
                    <span className="text-xs sm:text-sm font-medium">{tontineDetails.contributionAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Pénalité:</span>
                    <span className="text-xs sm:text-sm font-medium">{tontineDetails.penalty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Fréquence:</span>
                    <span className="text-xs sm:text-sm font-medium">{tontineDetails.frequency}</span>
                  </div>
                </div>
              </div>

              {/* Progression */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  <Label className="text-sm sm:text-base font-medium text-gray-900">Progression</Label>
                </div>
                <div className="bg-white border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Tour actuel:</span>
                    <span className="text-xs sm:text-sm font-medium">{tontine.currentTour}/{tontine.totalTours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Date début:</span>
                    <span className="text-xs sm:text-sm font-medium">{tontine.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Date fin prévue:</span>
                    <span className="text-xs sm:text-sm font-medium">{tontine.endDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations générales */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center">
                  <User className="w-3 h-3 text-purple-600" />
                </div>
                <Label className="text-sm sm:text-base font-medium text-gray-900">Informations générales</Label>
              </div>
              <div className="bg-white border rounded-lg p-3 sm:p-4 space-y-3">
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">Description:</span>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{tontineDetails.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex justify-between sm:block">
                    <span className="text-xs sm:text-sm text-gray-600">Créée par:</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 sm:mt-1 sm:block">{tontineDetails.createdBy}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-xs sm:text-sm text-gray-600">Date création:</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 sm:mt-1 sm:block">{tontineDetails.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Participants */}
          <TabsContent value="participants" className="space-y-3 sm:space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {participants.map((participant) => (
                <div key={participant.id} className="bg-white border rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            #{participant.position}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px]">{participant.email}</p>
                        <p className="text-xs text-gray-400">{participant.joinDate}</p>
                      </div>
                    </div>
                    <Badge variant={participant.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {participant.status === 'active' ? 'Actif' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Tours */}
          <TabsContent value="tours" className="space-y-2 mt-4">
            <div className="space-y-2">
              {tours.map((tour) => (
                <div key={tour.id} className={`bg-white border rounded-lg p-3 ${tour.status === 'current' ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tour.status === 'completed' ? 'bg-green-100 text-green-600' :
                        tour.status === 'current' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {tour.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                         tour.status === 'current' ? <Clock className="w-4 h-4" /> :
                         <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tour.month}</p>
                        <p className="text-xs text-gray-500">{tour.winner}</p>
                        <p className="text-xs text-gray-400">{tour.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{tour.amount}</p>
                      <Badge variant={
                        tour.status === 'completed' ? 'default' :
                        tour.status === 'current' ? 'secondary' :
                        'outline'
                      } className="text-xs">
                        {tour.status === 'completed' ? 'Terminé' :
                         tour.status === 'current' ? 'En cours' :
                         'À venir'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Ordre des gagnants */}
          <TabsContent value="winners" className="space-y-2 mt-4">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-yellow-100 rounded-md flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-yellow-600" />
                  </div>
                  <Label className="text-sm sm:text-base font-medium text-gray-900">Ordre de distribution</Label>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditingOrder ? (
                    <Button size="sm" variant="outline" onClick={startEditing} className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={cancelEditing} className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Annuler
                      </Button>
                      <Button size="sm" onClick={saveOrder} className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Sauver
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-white border rounded-lg p-3">
                <div className="space-y-3">
                  {!isEditingOrder ? (
                    // Mode affichage normal avec design amélioré
                    <div className="space-y-2">
                      {winnersOrder.map((winner, index) => (
                        <div key={winner.position} className={`relative flex items-center space-x-3 p-3 rounded-lg border ${
                          winner.status === 'completed' ? 'bg-green-50/50 border-green-200' :
                          winner.status === 'current' ? 'bg-yellow-50/50 border-yellow-300 border-2' :
                          'bg-gray-50 border-gray-200'
                        }`}>
                          {/* Ligne de connexion */}
                          {index < winnersOrder.length - 1 && (
                            <div className="absolute left-6 top-12 w-px h-6 bg-gray-300"></div>
                          )}

                          <div className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                            winner.status === 'completed' ? 'bg-green-100 text-green-600 border-green-300' :
                            winner.status === 'current' ? 'bg-yellow-100 text-yellow-600 border-yellow-300' :
                            'bg-gray-100 text-gray-600 border-gray-300'
                          }`}>
                            {winner.status === 'current' ? <Crown className="w-4 h-4" /> : winner.position}
                          </div>

                          <Avatar className="h-8 w-8 border-2 border-white">
                            <AvatarImage src={winner.avatar} />
                            <AvatarFallback className="text-xs">
                              {winner.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{winner.name}</p>
                            <p className="text-xs text-gray-500">
                              {winner.status === 'completed' ? 'A déjà reçu son tour' :
                               winner.status === 'current' ? 'Tour en cours' :
                               'En attente de son tour'}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {winner.status === 'completed' && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                            {winner.status === 'current' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                            <Badge variant={
                              winner.status === 'completed' ? 'default' :
                              winner.status === 'current' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {winner.status === 'completed' ? 'Reçu' :
                               winner.status === 'current' ? 'Prochain' :
                               'En attente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Mode édition avec drag & drop
                    <div className="space-y-3">
                      {/* Message d'information */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                          <GripVertical className="w-3 h-3 inline mr-1" />
                          Faites glisser les participants pour changer l'ordre. Le prochain gagnant ne peut pas être modifié.
                        </p>
                      </div>

                      {/* Éléments non modifiables (completed et current) */}
                      <div className="space-y-2">
                        {winnersOrder.filter(w => w.status === 'completed' || w.status === 'current').map((winner, index) => (
                          <div key={winner.position} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 border border-gray-200 opacity-60">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                              winner.status === 'completed' ? 'bg-green-100 text-green-600 border-green-300' :
                              'bg-yellow-100 text-yellow-600 border-yellow-300'
                            }`}>
                              {winner.status === 'current' ? <Crown className="w-4 h-4" /> : winner.position}
                            </div>
                            <Avatar className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={winner.avatar} />
                              <AvatarFallback className="text-xs">
                                {winner.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600">{winner.name}</p>
                              <p className="text-xs text-gray-500">
                                {winner.status === 'completed' ? 'Déjà reçu' : 'Prochain - non modifiable'}
                              </p>
                            </div>
                            <Badge variant={winner.status === 'completed' ? 'default' : 'secondary'} className="text-xs opacity-60">
                              {winner.status === 'completed' ? 'Reçu' : 'Prochain'}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Séparateur */}
                      {winnersOrder.filter(w => w.status === 'completed' || w.status === 'current').length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <span className="text-xs text-gray-500 bg-white px-2">Modifiables</span>
                          <div className="flex-1 h-px bg-gray-300"></div>
                        </div>
                      )}

                      {/* Éléments modifiables avec drag & drop */}
                      <div className="space-y-2">
                        {editableOrder.map((winner, index) => (
                          <div
                            key={winner.position}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className="relative flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border-2 border-orange-200 bg-orange-50/50 cursor-move hover:bg-orange-50 transition-colors"
                          >
                            {/* Numéro d'ordre en bannière mobile */}
                            <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm sm:hidden">
                              {winnersOrder.filter(w => w.status === 'completed' || w.status === 'current').length + index + 1}
                            </div>

                            <div className="flex items-center justify-center w-4 sm:w-6 text-orange-600">
                              <GripVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>

                            {/* Numéro d'ordre desktop */}
                            <div className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center font-bold text-xs bg-orange-100 text-orange-600 border border-orange-300">
                              <span className="text-xs">{winnersOrder.filter(w => w.status === 'completed' || w.status === 'current').length + index + 1}</span>
                            </div>

                            <Avatar className="h-8 w-8 border-2 border-white sm:ml-0">
                              <AvatarImage src={winner.avatar} />
                              <AvatarFallback className="text-xs">
                                {winner.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{winner.name}</p>
                              <p className="text-xs text-orange-600">Glissez pour réorganiser</p>
                            </div>

                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-orange-100"
                                onClick={() => moveUp(index)}
                                disabled={index === 0}
                              >
                                <ArrowRight className="w-3 h-3 -rotate-90" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-orange-100"
                                onClick={() => moveDown(index)}
                                disabled={index === editableOrder.length - 1}
                              >
                                <ArrowRight className="w-3 h-3 rotate-90" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}