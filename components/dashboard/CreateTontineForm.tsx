"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTontineSchema, type CreateTontineFormData, frequencyOptions } from "@/lib/validations/tontine";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Users, DollarSign, Clock, Settings, Sparkles, Target, TrendingUp, Shield, Zap, Gift, Search, X, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


// Mock users data
const mockUsers = [
  { id: '1', name: 'Marie Kouassi', email: 'marie.k@email.com', avatar: '/avatars/avatar-1.svg' },
  { id: '2', name: 'Jean Baptiste', email: 'jean.b@email.com', avatar: '/avatars/avatar-2.svg' },
  { id: '3', name: 'Fatima Diallo', email: 'fatima.d@email.com', avatar: '/avatars/avatar-3.svg' },
  { id: '4', name: 'Kofi Asante', email: 'kofi.a@email.com', avatar: '/avatars/avatar-4.svg' },
  { id: '5', name: 'Amina Traore', email: 'amina.t@email.com', avatar: '/avatars/avatar-5.svg' },
  { id: '6', name: 'Ibrahim Diop', email: 'ibrahim.d@email.com', avatar: '/avatars/avatar-6.svg' },
  { id: '7', name: 'Aïcha Bamba', email: 'aicha.b@email.com', avatar: '/avatars/avatar-7.svg' },
  { id: '8', name: 'Ousmane Kone', email: 'ousmane.k@email.com', avatar: '/avatars/avatar-8.svg' },
];

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export function CreateTontineForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTontineFormData>({
    resolver: zodResolver(createTontineSchema),
    mode: "onChange",
    defaultValues: {
      frequencyValue: 1,
      allowMultipleShares: true,
    },
  });

  const watchFrequencyType = watch("frequencyType");
  const watchAllowMultipleShares = watch("allowMultipleShares");
  const watchAmountPerRound = watch("amountPerRound");
  const watchMaxParticipants = watch("maxParticipants");

  // Calculate total amount per round
  const totalAmountPerRound = watchAmountPerRound && watchMaxParticipants 
    ? watchAmountPerRound * watchMaxParticipants 
    : 0;

  // Filter users that are not already selected
  const availableUsers = mockUsers.filter(user => 
    !selectedUsers.some(selected => selected.id === user.id)
  );

  // Filter users based on search query
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Add user to selection
  const addUser = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
    setUserSearchQuery('');
    setShowUserSearch(false);
  };

  // Remove user from selection
  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowUserSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: CreateTontineFormData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log("Tontine data:", {
        ...data,
        totalAmountPerRound,
        startDate,
        selectedUsers,
      });
      
      toast.success("Tontine créée avec succès!");
      setOpen(false);
      reset();
      setStartDate(undefined);
      setSelectedUsers([]);
      setUserSearchQuery('');
      setShowUserSearch(false);
    } catch (error) {
      toast.error("Erreur lors de la création de la tontine");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Créer une tontine
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="relative pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Nouvelle Tontine
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600">
                  Créez votre tontine en quelques étapes simples
                </DialogDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 self-start sm:self-center">
              <Zap className="w-3 h-3 mr-1" />
              Rapide
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Layout principal en grille */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Colonne gauche - Informations principales */}
            <div className="space-y-4 sm:space-y-6">
              {/* Informations de base */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Informations de base</h3>
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Essentiel</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nom de la tontine <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ex: Tontine Famille, Épargne Projet..."
                      {...register("name")}
                      className={cn("h-10", errors.name ? "border-red-500" : "")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez l'objectif de votre tontine..."
                      rows={3}
                      className="resize-none"
                      {...register("description")}
                    />
                  </div>
                </div>
              </div>

              {/* Sélection des participants */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Participants</h3>
                  <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                    {selectedUsers.length} sélectionné{selectedUsers.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {/* User search */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ajouter des participants</Label>
                    <div className="relative" ref={searchRef}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher un utilisateur par nom ou email..."
                          value={userSearchQuery}
                          onChange={(e) => {
                            setUserSearchQuery(e.target.value);
                            setShowUserSearch(e.target.value.length > 0);
                          }}
                          className="pl-10 h-10"
                          onFocus={() => setShowUserSearch(userSearchQuery.length > 0)}
                        />
                      </div>
                      
                      {/* Search results dropdown */}
                      {showUserSearch && filteredUsers.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredUsers.slice(0, 5).map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => addUser(user)}
                              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                              <Plus className="w-4 h-4 text-gray-400" />
                            </button>
                          ))}
                          {filteredUsers.length > 5 && (
                            <div className="px-4 py-2 text-xs text-gray-500 border-t">
                              +{filteredUsers.length - 5} autres résultats...
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* No results */}
                      {showUserSearch && userSearchQuery.length > 0 && filteredUsers.length === 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
                          <p className="text-sm text-gray-500 text-center">Aucun utilisateur trouvé</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected users */}
                  {selectedUsers.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Participants sélectionnés</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-1.5 hover:bg-indigo-100 transition-colors"
                          >
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-indigo-900 truncate max-w-20">{user.name}</span>
                            <button
                              type="button"
                              onClick={() => removeUser(user.id)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Info about participants */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">À propos des participants</p>
                        <p className="text-xs mt-1">
                          Les utilisateurs sélectionnés recevront une invitation à rejoindre cette tontine. 
                          Vous pouvez également ajouter des participants plus tard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration financière */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Configuration financière</h3>
                  <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">Obligatoire</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amountPerRound" className="flex items-center text-sm font-medium">
                      <TrendingUp className="w-3 h-3 mr-2 text-green-600" />
                      Montant par tour (FCFA) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amountPerRound"
                      type="number"
                      min="1000"
                      step="500"
                      placeholder="25 000"
                      className={cn("h-10", errors.amountPerRound ? "border-red-500" : "")}
                      {...register("amountPerRound", { valueAsNumber: true })}
                    />
                    {errors.amountPerRound && (
                      <p className="text-xs text-red-500">{errors.amountPerRound.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants" className="flex items-center text-sm font-medium">
                      <Users className="w-3 h-3 mr-2 text-blue-600" />
                      Nombre maximum de participants
                    </Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="2"
                      max="50"
                      placeholder="10"
                      className={cn("h-10", errors.maxParticipants ? "border-red-500" : "")}
                      {...register("maxParticipants", { valueAsNumber: true })}
                    />
                    {errors.maxParticipants && (
                      <p className="text-xs text-red-500">{errors.maxParticipants.message}</p>
                    )}
                  </div>

                  {totalAmountPerRound > 0 && (
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center space-x-3">
                        <Gift className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            Montant total par tour
                          </p>
                          <p className="text-lg font-bold text-emerald-900">
                            {totalAmountPerRound.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne droite - Paramètres et options */}
            <div className="space-y-4 sm:space-y-6">
              {/* Calendrier et fréquence */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Calendrier & Fréquence</h3>
                  <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">Planning</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="frequencyType" className="text-sm font-medium">
                        Fréquence <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => setValue("frequencyType", value as any)}>
                        <SelectTrigger className={cn("h-10", errors.frequencyType ? "border-red-500" : "")}>
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.frequencyType && (
                        <p className="text-xs text-red-500">{errors.frequencyType.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequencyValue" className="text-sm font-medium">
                        Intervalle
                      </Label>
                      <Input
                        id="frequencyValue"
                        type="number"
                        min="1"
                        max={watchFrequencyType === "DAILY" ? "30" : 
                             watchFrequencyType === "WEEKLY" ? "12" :
                             watchFrequencyType === "MONTHLY" ? "12" : "5"}
                        className="h-10"
                        placeholder="1"
                        {...register("frequencyValue", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Date de début <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-10 justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                            errors.startDate && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            setValue("startDate", date!);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && (
                      <p className="text-xs text-red-500">{errors.startDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Options avancées */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Options avancées</h3>
                  <Badge variant="outline" className="text-xs border-gray-300">Optionnel</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Parts multiples</Label>
                      <p className="text-xs text-gray-600">
                        Permettre aux participants de prendre plusieurs parts
                      </p>
                    </div>
                    <Switch
                      checked={watchAllowMultipleShares}
                      onCheckedChange={(checked) => setValue("allowMultipleShares", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 sm:pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
                setStartDate(undefined);
                setSelectedUsers([]);
                setUserSearchQuery('');
                setShowUserSearch(false);
              }}
              disabled={isLoading}
              className="h-10"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || isLoading}
              className="h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Créer la tontine
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}