"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CreditCard,
  Bell,
  Settings,
  Edit,
  Save,
  Key,
  Upload,
  FileText,
  ImageIcon,
  Camera,
  Check,
  BadgeCheck
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileProps {
  onAvatarChange?: (avatar: string) => void;
  currentAvatar?: string;
}

export default function Profile({ onAvatarChange, currentAvatar }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+229 97 12 34 56",
    address: "Quartier Fidjrossè, Cotonou, Bénin",
    joinDate: "Janvier 2024",
    document: "/images/id.jpg", // "/images/id.jpg" pour tester avec une image - mettre null pour non vérifié
    avatar: currentAvatar || "/avatars/avatar-portrait-svgrepo-com.svg",
    isEmailVerified: true,
    isDocumentVerified: true // sera true si document existe et est vérifié
  });
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(formData.avatar);
  
  // Liste des avatars disponibles
  const availableAvatars = [
    "/avatars/avatar-jjuoud.svg",
    "/avatars/avatar-jkjnlef.svg",
    "/avatars/avatar-kjhfefg.svg",
    "/avatars/avatar-kpdkoe.svg",
    "/avatars/avatar-azioce.svg",
    "/avatars/avatar-lnjhsze.svg",
    "/avatars/avatar-nbxed.svg",
    "/avatars/avatar-wvesouh.svg"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Ici vous ajouteriez la logique d'upload du fichier
      // Pour la démo, on simule un chemin de fichier
      const mockPath = `/documents/${file.name}`;
      setFormData(prev => ({ ...prev, document: mockPath }));
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const openDocument = () => {
    if (formData.document) {
      // Ouvre le document dans une nouvelle fenêtre
      window.open(formData.document, '_blank');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Ici vous pouvez ajouter la logique pour sauvegarder les données
  };

  const handleAvatarUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Ici vous ajouteriez la logique d'upload du fichier avatar
      const mockPath = `/uploads/avatar-${Date.now()}.${file.name.split('.').pop()}`;
      setSelectedAvatar(mockPath);
    }
  };

  const handleAvatarSave = () => {
    setFormData(prev => ({ ...prev, avatar: selectedAvatar }));
    // Notifier le parent du changement d'avatar
    if (onAvatarChange) {
      onAvatarChange(selectedAvatar);
    }
    setIsAvatarModalOpen(false);
  };

  const handleAvatarCancel = () => {
    setSelectedAvatar(formData.avatar);
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500 bg-purple-50 flex items-center justify-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={formData.avatar} 
                    alt="Jean Dupont"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-6 w-6 p-0 rounded-full bg-white border-2 border-white shadow-sm hover:shadow-md"
                onClick={() => setIsAvatarModalOpen(true)}
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 font-poppins">{formData.name}</h2>
                {formData.isEmailVerified && formData.isDocumentVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">{formData.email}</p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1 text-xs">
                <Shield className="w-2.5 h-2.5 mr-1" />
                Vérifié
              </Badge>
            </div>
          </div>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm"
            className="sm:flex-shrink-0 w-full sm:w-auto"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <User className="w-4 h-4 mr-2 text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">Informations personnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-xs font-medium text-gray-600 mb-1 block">Nom complet</Label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-blue-500" />
                    <Input 
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-9 pl-9"
                    />
                  </div>
                ) : (
                  <div className="flex items-center p-2 rounded border bg-gray-50 h-9">
                    <User className="w-3 h-3 mr-2 text-blue-500" />
                    <span className="text-sm">{formData.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-medium text-gray-600 mb-1 block">Adresse email</Label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-green-500" />
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-9 pl-9"
                    />
                  </div>
                ) : (
                  <div className="flex items-center p-2 rounded border bg-gray-50 h-9">
                    <Mail className="w-3 h-3 mr-2 text-green-500" />
                    <span className="text-sm">{formData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-medium text-gray-600 mb-1 block">Numéro de téléphone</Label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-purple-500" />
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-9 pl-9"
                    />
                  </div>
                ) : (
                  <div className="flex items-center p-2 rounded border bg-gray-50 h-9">
                    <Phone className="w-3 h-3 mr-2 text-purple-500" />
                    <span className="text-sm">{formData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="text-xs font-medium text-gray-600 mb-1 block">Adresse</Label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-orange-500" />
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="h-9 pl-9"
                    />
                  </div>
                ) : (
                  <div className="flex items-center p-2 rounded border bg-gray-50 h-9">
                    <MapPin className="w-3 h-3 mr-2 text-orange-500" />
                    <span className="text-sm">{formData.address}</span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-medium text-gray-600 mb-1 block">Document d'identité (CNI/CIP/Passeport)</Label>
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image existante */}
                    {formData.document && (
                      <div className="flex-shrink-0 self-start">
                        <div 
                          onClick={openDocument}
                          className="cursor-pointer group relative"
                        >
                          <img 
                            src={formData.document} 
                            alt="Document d'identité" 
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-green-300 shadow-sm group-hover:shadow-md transition-shadow"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                            <div className="w-6 h-6 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all">
                              <ImageIcon className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Zone de drag & drop - Toujours visible en mode édition */}
                    <div className={`${formData.document ? 'flex-1' : 'w-full'}`}>
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-3 transition-colors cursor-pointer h-24 sm:h-32 ${
                          isDragOver 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => document.getElementById('document-upload')?.click()}
                      >
                        <div className="flex flex-col items-center justify-center h-full space-y-1">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Upload className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-700">
                              {formData.document ? 'Remplacer le document' : 'Glissez votre document ici'}
                            </p>
                            <p className="text-xs text-gray-500">
                              ou cliquez pour parcourir
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 10MB</p>
                          </div>
                        </div>
                        <input
                          id="document-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleInputChange2}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  formData.document ? (
                    <div className="flex justify-center">
                      <div 
                        onClick={openDocument}
                        className="cursor-pointer group relative"
                      >
                        <img 
                          src={formData.document} 
                          alt="Document d'identité" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-green-300 shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                          <div className="w-8 h-8 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all">
                            <ImageIcon className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          <span className="text-xs text-green-600 font-medium bg-white px-2 py-1 rounded shadow-sm">Document vérifié</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-4 sm:p-6">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">Aucun document chargé</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1 block">Membre depuis</Label>
                <div className="flex items-center p-2 rounded border bg-gray-50 h-9">
                  <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                  <span className="text-sm">{formData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div>
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Paramètres du compte</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start h-9 text-sm">
                <Key className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Changer le mot de passe</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-9 text-sm">
                <Bell className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Préférences notifications</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-9 text-sm">
                <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Méthodes de paiement</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-9 text-sm">
                <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Paramètres avancés</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de sélection d'avatar */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="mx-auto sm:max-w-md max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center text-base sm:text-lg">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Changer l'avatar
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Sélectionnez un avatar prédéfini ou téléchargez votre propre photo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Avatars prédéfinis */}
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">Avatars prédéfinis</Label>
              <div className="flex flex-wrap gap-y-2 sm:gap-y-3 space-x-2 sm:space-x-3">
                {availableAvatars.map((avatar, index) => {
                  const borderColors = [
                    'border-blue-500',
                    'border-green-500', 
                    'border-purple-500',
                    'border-orange-500',
                    'border-pink-500',
                    'border-indigo-500',
                    'border-red-500',
                    'border-teal-500'
                  ];
                  const bgColors = [
                    'bg-blue-50',
                    'bg-green-50',
                    'bg-purple-50', 
                    'bg-orange-50',
                    'bg-pink-50',
                    'bg-indigo-50',
                    'bg-red-50',
                    'bg-teal-50'
                  ];
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedAvatar(avatar)}
                      className="relative transition-all hover:scale-105"
                    >
                      {/* Cercle avec bordure colorée */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedAvatar === avatar 
                          ? `${borderColors[index]} ${bgColors[index]} shadow-lg` 
                          : `${borderColors[index]} bg-white hover:${bgColors[index]}`
                      }`}>
                        {/* Avatar à l'intérieur du cercle */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                          <img 
                            src={avatar} 
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {selectedAvatar === avatar && (
                        <div className="absolute -top-0.5 -right-1 sm:-top-1 sm:-right-2 h-3 w-3 sm:h-3.5 sm:w-3.5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                          <Check className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload personnalisé */}
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">Photo personnalisée</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-gray-400 transition-colors">
                <div className="space-y-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      Télécharger une photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Prévisualisation */}
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">Prévisualisation</Label>
              <div className="flex items-center space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedAvatar} 
                    alt="Prévisualisation avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Jean Dupont</p>
                  <p className="text-xs text-gray-500">Aperçu de votre profil</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={handleAvatarCancel} className="w-full sm:w-auto text-sm">
              Annuler
            </Button>
            <Button onClick={handleAvatarSave} className="w-full sm:w-auto text-sm">
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}