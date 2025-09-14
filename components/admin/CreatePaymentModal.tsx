"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  User,
  Users,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle,
  Search,
  X,
} from "lucide-react";

// Mock data
const mockUsers = [
  { id: "1", name: "Jean Dupont", email: "jean@example.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg" },
  { id: "2", name: "Marie Kone", email: "marie.kone@email.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg" },
  { id: "3", name: "Amadou Diallo", email: "amadou.diallo@gmail.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg" },
  { id: "4", name: "Fatou Traore", email: "fatou.traore@yahoo.fr", avatar: "/avatars/avatar-portrait-svgrepo-com.svg" },
  { id: "5", name: "Boubacar Cisse", email: "boubacar.cisse@outlook.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg" },
  { id: "6", name: "Aicha Sow", email: "aicha.sow@hotmail.com", avatar: "/avatars/avatar-portrait-svgrepo-com.svg" }
];

const mockTontines = [
  { id: "1", name: "Tontine Famille", participants: 12, amount: "85,000 FCFA", status: "active" },
  { id: "2", name: "Épargne Projet", participants: 8, amount: "50,000 FCFA", status: "active" },
  { id: "3", name: "Business Fund", participants: 6, amount: "25,000 FCFA", status: "active" },
  { id: "4", name: "Groupe Amis", participants: 10, amount: "30,000 FCFA", status: "pending" },
  { id: "5", name: "Tontine Étudiants", participants: 15, amount: "15,000 FCFA", status: "active" },
  { id: "6", name: "Solidarité Femmes", participants: 20, amount: "40,000 FCFA", status: "active" }
];

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type Tontine = {
  id: string;
  name: string;
  participants: number;
  amount: string;
  status: string;
};

interface CreatePaymentModalProps {
  trigger?: React.ReactNode;
}

export default function CreatePaymentModal({ trigger }: CreatePaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTontine, setSelectedTontine] = useState<Tontine | null>(null);
  const [paymentType, setPaymentType] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // User search states
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  const userSearchRef = useRef<HTMLDivElement>(null);

  // Tontine search states
  const [tontineSearchQuery, setTontineSearchQuery] = useState("");
  const [showTontineSearch, setShowTontineSearch] = useState(false);
  const tontineSearchRef = useRef<HTMLDivElement>(null);

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Filter tontines based on search query
  const filteredTontines = mockTontines.filter(tontine =>
    tontine.name.toLowerCase().includes(tontineSearchQuery.toLowerCase())
  );

  // Select user
  const selectUser = (user: User) => {
    setSelectedUser(user);
    setUserSearchQuery(user.name);
    setShowUserSearch(false);
  };

  // Select tontine
  const selectTontine = (tontine: Tontine) => {
    setSelectedTontine(tontine);
    setTontineSearchQuery(tontine.name);
    setShowTontineSearch(false);
  };

  // Clear user selection
  const clearUserSelection = () => {
    setSelectedUser(null);
    setUserSearchQuery("");
    setShowUserSearch(false);
  };

  // Clear tontine selection
  const clearTontineSelection = () => {
    setSelectedTontine(null);
    setTontineSearchQuery("");
    setShowTontineSearch(false);
  };

  // Close search dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userSearchRef.current && !userSearchRef.current.contains(event.target as Node)) {
        setShowUserSearch(false);
      }
      if (tontineSearchRef.current && !tontineSearchRef.current.contains(event.target as Node)) {
        setShowTontineSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = () => {
    // TODO: Implement payment creation logic
    console.log({
      user: selectedUser,
      tontine: selectedTontine,
      type: paymentType,
      amount,
      note
    });

    // Reset form
    setSelectedUser(null);
    setSelectedTontine(null);
    setPaymentType("");
    setAmount("");
    setNote("");
    setUserSearchQuery("");
    setTontineSearchQuery("");
    setOpen(false);
  };

  const defaultTrigger = (
    <Button className="bg-green-600 hover:bg-green-700">
      <Plus className="w-4 h-4 mr-2" />
      Nouveau paiement
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="!max-w-2xl w-[95vw] max-h-[85vh] md:max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="relative pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-start text-gray-900">
                  Nouveau paiement
                </DialogTitle>
                <p className="text-sm sm:text-base text-start text-gray-600">
                  Enregistrer une transaction manuelle
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Recherche utilisateur */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              <Label className="text-sm font-medium text-gray-900">Utilisateur</Label>
            </div>
            <div className="relative" ref={userSearchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={selectedUser ? selectedUser.name : "Rechercher un utilisateur..."}
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setShowUserSearch(e.target.value.length > 0);
                    if (e.target.value === "") {
                      clearUserSelection();
                    }
                  }}
                  className="pl-10"
                  onFocus={() => setShowUserSearch(userSearchQuery.length > 0)}
                />
                {selectedUser && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={clearUserSelection}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Search results dropdown */}
              {showUserSearch && filteredUsers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredUsers.slice(0, 5).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => selectUser(user)}
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

            {/* Selected user card */}
            {selectedUser && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback className="text-xs">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-900 truncate">{selectedUser.name}</p>
                    <p className="text-xs text-blue-600 truncate">{selectedUser.email}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            )}
          </div>

          {/* Recherche tontine */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center">
                <Users className="w-3 h-3 text-purple-600" />
              </div>
              <Label className="text-sm font-medium text-gray-900">Tontine</Label>
            </div>
            <div className="relative" ref={tontineSearchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={selectedTontine ? selectedTontine.name : "Rechercher une tontine..."}
                  value={tontineSearchQuery}
                  onChange={(e) => {
                    setTontineSearchQuery(e.target.value);
                    setShowTontineSearch(e.target.value.length > 0);
                    if (e.target.value === "") {
                      clearTontineSelection();
                    }
                  }}
                  className="pl-10"
                  onFocus={() => setShowTontineSearch(tontineSearchQuery.length > 0)}
                />
                {selectedTontine && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={clearTontineSelection}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Search results dropdown */}
              {showTontineSearch && filteredTontines.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredTontines.slice(0, 5).map((tontine) => (
                    <button
                      key={tontine.id}
                      type="button"
                      onClick={() => selectTontine(tontine)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-md flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{tontine.name}</p>
                        <p className="text-xs text-gray-500">{tontine.participants} participants • {tontine.amount}</p>
                      </div>
                    </button>
                  ))}
                  {filteredTontines.length > 5 && (
                    <div className="px-4 py-2 text-xs text-gray-500 border-t">
                      +{filteredTontines.length - 5} autres résultats...
                    </div>
                  )}
                </div>
              )}

              {/* No results */}
              {showTontineSearch && tontineSearchQuery.length > 0 && filteredTontines.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
                  <p className="text-sm text-gray-500 text-center">Aucune tontine trouvée</p>
                </div>
              )}
            </div>

            {/* Selected tontine card */}
            {selectedTontine && (
              <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-md flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-purple-900 truncate">{selectedTontine.name}</p>
                    <p className="text-xs text-purple-600 truncate">{selectedTontine.participants} participants • {selectedTontine.amount}</p>
                  </div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            )}
          </div>

          {/* Type de paiement */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-100 rounded-md flex items-center justify-center">
                <CreditCard className="w-3 h-3 text-orange-600" />
              </div>
              <Label className="text-sm font-medium text-gray-900">Type</Label>
            </div>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contribution">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Contribution</p>
                      <p className="text-xs text-gray-500">Versement</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="distribution">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Distribution</p>
                      <p className="text-xs text-gray-500">Retrait</p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Montant */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-green-600" />
              </div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-900">Montant</Label>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                min="0"
                step="500"
                className="pl-12"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                FCFA
              </div>
            </div>

            {/* Montants prédéfinis */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Montants rapides</Label>
              <div className="flex flex-wrap gap-1.5">
                {[2000, 5000, 10000, 25000, 50000].map((presetAmount) => (
                  <button
                    key={presetAmount}
                    type="button"
                    onClick={() => setAmount(presetAmount.toString())}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      parseInt(amount) === presetAmount
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {presetAmount.toLocaleString('fr-FR')} FCFA
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Note optionnelle */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
                <FileText className="w-3 h-3 text-gray-600" />
              </div>
              <Label htmlFor="payment-note" className="text-sm font-medium text-gray-900">Note</Label>
            </div>
            <Input
              id="payment-note"
              placeholder="Référence ou commentaire..."
              maxLength={100}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
          <Button
            variant="outline"
            className="flex-1 h-10 sm:h-11"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button
            className="flex-1 h-10 sm:h-11"
            onClick={handleSubmit}
            disabled={!selectedUser || !selectedTontine || !paymentType || !amount}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Enregistrer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}