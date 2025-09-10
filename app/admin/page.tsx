"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus,
  Bell,
  Settings,
  LogOut,
  User,
  CreditCard,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Eye,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  BadgeCheck,
  Ban,
  UserPlus,
  FileText,
  X,
  Phone,
  MapPin,
  Mail
} from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalTontines: 156,
    activeTontines: 89,
    totalTransactions: 3420,
    totalRevenue: "2,450,000 FCFA",
    pendingVerifications: 23,
    newUsersThisWeek: 47
  };

  const recentUsers = [
    { id: 1, name: "Marie Kouassi", email: "marie.k@email.com", status: "active", verified: true, joinDate: "2024-01-15", avatar: "/avatars/avatar-jjuoud.svg" },
    { id: 2, name: "Jean Baptiste", email: "jean.b@email.com", status: "pending", verified: false, joinDate: "2024-01-14", avatar: "/avatars/avatar-jkjnlef.svg" },
    { id: 3, name: "Fatima Diallo", email: "fatima.d@email.com", status: "active", verified: true, joinDate: "2024-01-13", avatar: "/avatars/avatar-kjhfefg.svg" },
    { id: 4, name: "Kofi Asante", email: "kofi.a@email.com", status: "suspended", verified: false, joinDate: "2024-01-12", avatar: "/avatars/avatar-kpdkoe.svg" },
    { id: 5, name: "Amina Traore", email: "amina.t@email.com", status: "active", verified: true, joinDate: "2024-01-11", avatar: "/avatars/avatar-azioce.svg" }
  ];

  const recentTontines = [
    { id: 1, name: "Tontine Famille Kouassi", participants: 12, amount: "50,000", status: "active", creator: "Marie Kouassi", date: "2024-01-15" },
    { id: 2, name: "Épargne Étudiants", participants: 8, amount: "25,000", status: "completed", creator: "Jean Baptiste", date: "2024-01-10" },
    { id: 3, name: "Business Network", participants: 15, amount: "100,000", status: "active", creator: "Fatima Diallo", date: "2024-01-08" },
    { id: 4, name: "Tontine Marché", participants: 20, amount: "30,000", status: "pending", creator: "Kofi Asante", date: "2024-01-05" }
  ];

  const recentTransactions = [
    { id: 1, user: "Marie Kouassi", tontine: "Tontine Famille", amount: "50,000", type: "payment", status: "completed", date: "2024-01-15 14:30" },
    { id: 2, user: "Jean Baptiste", tontine: "Épargne Étudiants", amount: "25,000", type: "withdrawal", status: "pending", date: "2024-01-15 12:15" },
    { id: 3, user: "Fatima Diallo", tontine: "Business Network", amount: "100,000", type: "payment", status: "completed", date: "2024-01-15 10:45" },
    { id: 4, user: "Amina Traore", tontine: "Tontine Marché", amount: "30,000", type: "payment", status: "failed", date: "2024-01-15 09:20" }
  ];

  return (
    <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="Logo Tontine" 
                className="w-16 h-12 sm:w-23 sm:h-16 object-contain"
              />
              <div className="hidden sm:block">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <Bell className="w-3 h-3 mr-1" />
                {stats.pendingVerifications}
              </Badge>
              
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-red-50 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-red-300 transition-all shadow-sm">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img 
                          src="/avatars/avatar-portrait-svgrepo-com.svg" 
                          alt="Admin"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="space-y-1">
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profil Admin
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres système
                      </Button>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter données
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Activity className="w-4 h-4 mr-2" />
                        Logs système
                      </Button>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* Admin Info Block */}
        <div className="bg-white border p-3 rounded-lg mb-4 max-w-full sm:max-w-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-red-500 bg-red-50 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <img 
                  src="/avatars/avatar-portrait-svgrepo-com.svg" 
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-medium text-gray-900 font-poppins truncate text-sm">Admin Principal</h3>
                <Shield className="w-3 h-3 text-red-600 flex-shrink-0" />
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-gray-400 mr-1">@</span>
                <span className="truncate">admin@tontine.com</span>
              </div>
            </div>
          </div>
        </div>

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
                Tableau de bord
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("users")}
                className="flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Utilisateurs
              </Button>
              <Button
                variant={activeTab === "tontines" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("tontines")}
                className="flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
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
                variant={activeTab === "settings" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("settings")}
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                {stats.activeUsers} utilisateurs actifs
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                ✓ {stats.activeTontines} tontines actives
              </Badge>
              <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                ⏳ {stats.pendingVerifications} vérifications en attente
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
                <BreadcrumbPage>Administration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Utilisateurs totaux</p>
                    <p className="text-xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{stats.newUsersThisWeek} cette semaine</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Tontines actives</p>
                    <p className="text-xl font-bold">{stats.activeTontines}</p>
                    <p className="text-xs text-gray-500">sur {stats.totalTontines} au total</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Transactions</p>
                    <p className="text-xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Volume total traité</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Revenus totaux</p>
                    <p className="text-xl font-bold">{stats.totalRevenue}</p>
                    <p className="text-xs text-gray-500">Depuis le lancement</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Validations en attente</CardTitle>
                  <CardDescription>Utilisateurs nécessitant une validation</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="text-xs font-medium text-gray-500 pb-2">Utilisateur</th>
                          <th className="text-xs font-medium text-gray-500 pb-2">Email</th>
                          <th className="text-xs font-medium text-gray-500 pb-2">Document</th>
                          <th className="text-xs font-medium text-gray-500 pb-2">Inscription</th>
                          <th className="text-xs font-medium text-gray-500 pb-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[
                          { 
                            name: "Marie Kouadio", 
                            email: "marie.k@email.com", 
                            date: "Il y a 2h", 
                            avatar: "/avatars/avatar-jjuoud.svg",
                            emailStatus: "pending",
                            documentStatus: "pending",
                            id: "user-1"
                          },
                          { 
                            name: "Adama Traoré", 
                            email: "adama.t@email.com", 
                            date: "Il y a 5h", 
                            avatar: "/avatars/avatar-jkjnlef.svg",
                            emailStatus: "verified",
                            documentStatus: "pending",
                            id: "user-2"
                          },
                          { 
                            name: "Fatou Diallo", 
                            email: "fatou.d@email.com", 
                            date: "Il y a 1j", 
                            avatar: "/avatars/avatar-kjqhvbq.svg",
                            emailStatus: "pending",
                            documentStatus: "submitted",
                            id: "user-3"
                          }
                        ].map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200">
                                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-600">{user.email}</span>
                                <div className={`w-2 h-2 rounded-full ${
                                  user.emailStatus === 'verified' ? 'bg-green-500' : 
                                  user.emailStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center space-x-1">
                                <Badge variant="outline" className={`text-xs ${
                                  user.documentStatus === 'verified' ? 'text-green-700 border-green-200 bg-green-50' :
                                  user.documentStatus === 'submitted' ? 'text-blue-700 border-blue-200 bg-blue-50' :
                                  user.documentStatus === 'pending' ? 'text-yellow-700 border-yellow-200 bg-yellow-50' :
                                  'text-red-700 border-red-200 bg-red-50'
                                }`}>
                                  {user.documentStatus === 'verified' ? 'Vérifié' :
                                   user.documentStatus === 'submitted' ? 'Soumis' :
                                   user.documentStatus === 'pending' ? 'En attente' : 'Rejeté'}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="text-xs text-gray-400">{user.date}</span>
                            </td>
                            <td className="py-3">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <FileText className="w-4 h-4 mr-1" />
                                    Valider
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Validation - {user.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {/* User info compact */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                                          <Badge variant="outline" className={`text-xs ${
                                            user.emailStatus === 'verified' ? 'text-green-700 border-green-200 bg-green-50' : 'text-yellow-700 border-yellow-200 bg-yellow-50'
                                          }`}>
                                            {user.emailStatus === 'verified' ? 'Vérifié' : 'En attente'}
                                          </Badge>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                                            <Mail className="w-2.5 h-2.5 text-blue-600" />
                                          </div>
                                          <span className="text-xs text-gray-700">{user.email}</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                          <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                                            <Phone className="w-2.5 h-2.5 text-green-600" />
                                          </div>
                                          <span className="text-xs text-gray-700">+225 07 12 34 56</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                          <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
                                            <MapPin className="w-2.5 h-2.5 text-orange-600" />
                                          </div>
                                          <span className="text-xs text-gray-700">Abidjan</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Documents compact */}
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-gray-900">Documents</h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="border rounded p-2">
                                          <p className="text-xs font-medium mb-1">Recto</p>
                                          <div className="bg-gray-100 rounded h-16 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                          </div>
                                        </div>
                                        <div className="border rounded p-2">
                                          <p className="text-xs font-medium mb-1">Verso</p>
                                          <div className="bg-gray-100 rounded h-16 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-gray-900">Message (optionnel)</label>
                                      <textarea
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                                        rows={2}
                                        placeholder="Message pour l'utilisateur..."
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter className="space-x-2">
                                    <Button variant="outline" size="sm">Annuler</Button>
                                    <Button variant="destructive" size="sm">
                                      <X className="w-3 h-3 mr-1" />
                                      Rejeter
                                    </Button>
                                    <Button size="sm">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Valider
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-3">
                    {[
                      { 
                        name: "Marie Kouadio", 
                        email: "marie.k@email.com", 
                        date: "Il y a 2h", 
                        avatar: "/avatars/avatar-jjuoud.svg",
                        emailStatus: "pending",
                        documentStatus: "pending",
                        id: "user-1"
                      },
                      { 
                        name: "Adama Traoré", 
                        email: "adama.t@email.com", 
                        date: "Il y a 5h", 
                        avatar: "/avatars/avatar-jkjnlef.svg",
                        emailStatus: "verified",
                        documentStatus: "pending",
                        id: "user-2"
                      },
                      { 
                        name: "Fatou Diallo", 
                        email: "fatou.d@email.com", 
                        date: "Il y a 1j", 
                        avatar: "/avatars/avatar-kjqhvbq.svg",
                        emailStatus: "pending",
                        documentStatus: "submitted",
                        id: "user-3"
                      }
                    ].map((user, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200">
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.date}</p>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-1" />
                                Valider
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Validation - {user.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* User info compact */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                                      <Badge variant="outline" className={`text-xs ${
                                        user.emailStatus === 'verified' ? 'text-green-700 border-green-200 bg-green-50' : 'text-yellow-700 border-yellow-200 bg-yellow-50'
                                      }`}>
                                        {user.emailStatus === 'verified' ? 'Vérifié' : 'En attente'}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                                        <Mail className="w-2.5 h-2.5 text-blue-600" />
                                      </div>
                                      <span className="text-xs text-gray-700">{user.email}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                                        <Phone className="w-2.5 h-2.5 text-green-600" />
                                      </div>
                                      <span className="text-xs text-gray-700">+225 07 12 34 56</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
                                        <MapPin className="w-2.5 h-2.5 text-orange-600" />
                                      </div>
                                      <span className="text-xs text-gray-700">Abidjan</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Documents compact */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Documents</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="border rounded p-2">
                                      <p className="text-xs font-medium mb-1">Recto</p>
                                      <div className="bg-gray-100 rounded h-16 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                      </div>
                                    </div>
                                    <div className="border rounded p-2">
                                      <p className="text-xs font-medium mb-1">Verso</p>
                                      <div className="bg-gray-100 rounded h-16 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-gray-900">Message (optionnel)</label>
                                  <textarea
                                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                                    rows={2}
                                    placeholder="Message pour l'utilisateur..."
                                  />
                                </div>
                              </div>
                              <DialogFooter className="space-x-2">
                                <Button variant="outline" size="sm">Annuler</Button>
                                <Button variant="destructive" size="sm">
                                  <X className="w-3 h-3 mr-1" />
                                  Rejeter
                                </Button>
                                <Button size="sm">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Valider
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">{user.email}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              user.emailStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                          </div>
                          <Badge variant="outline" className={`text-xs ${
                            user.documentStatus === 'verified' ? 'text-green-700 border-green-200 bg-green-50' :
                            user.documentStatus === 'submitted' ? 'text-blue-700 border-blue-200 bg-blue-50' :
                            user.documentStatus === 'pending' ? 'text-yellow-700 border-yellow-200 bg-yellow-50' :
                            'text-red-700 border-red-200 bg-red-50'
                          }`}>
                            {user.documentStatus === 'verified' ? 'Vérifié' :
                             user.documentStatus === 'submitted' ? 'Soumis' :
                             user.documentStatus === 'pending' ? 'En attente' : 'Rejeté'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transactions récentes</CardTitle>
                  <CardDescription>Les dernières transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{transaction.user}</p>
                            {transaction.type === 'payment' ? (
                              <TrendingUp className="w-3 h-3 text-green-600" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{transaction.amount} FCFA • {transaction.tontine}</p>
                        </div>
                        <Badge variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                          {transaction.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                           transaction.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : 
                           <XCircle className="w-3 h-3 mr-1" />}
                          {transaction.status === 'completed' ? 'Terminé' : transaction.status === 'pending' ? 'En cours' : 'Échec'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-80"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="suspended">Suspendus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>Liste de tous les utilisateurs de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Vérifications</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-medium">{user.name}</p>
                                {user.verified && <BadgeCheck className="w-3 h-3 text-blue-600" />}
                              </div>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}>
                            {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Suspendu'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-xs">Email</span>
                            {user.verified ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-xs">Document</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span className="text-xs">Document</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              {user.status === 'suspended' ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tontines" && (
          <div className="space-y-6">
            {/* Tontines Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Tontines actives</p>
                    <p className="text-xl font-bold">{stats.activeTontines}</p>
                    <p className="text-xs text-gray-500">Cycles en cours</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">En attente</p>
                    <p className="text-xl font-bold">12</p>
                    <p className="text-xs text-gray-500">Validation nécessaire</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Terminées</p>
                    <p className="text-xl font-bold">55</p>
                    <p className="text-xs text-gray-500">Cycles complétés</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Tontines Table */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion des tontines</CardTitle>
                <CardDescription>Liste de toutes les tontines créées</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tontine</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTontines.map((tontine) => (
                      <TableRow key={tontine.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{tontine.name}</p>
                            <p className="text-sm text-gray-500">Par {tontine.creator}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-gray-400" />
                            {tontine.participants}
                          </div>
                        </TableCell>
                        <TableCell>{tontine.amount} FCFA</TableCell>
                        <TableCell>
                          <Badge variant={tontine.status === 'active' ? 'default' : tontine.status === 'completed' ? 'secondary' : 'outline'}>
                            {tontine.status === 'active' ? 'Active' : tontine.status === 'completed' ? 'Terminée' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(tontine.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Transactions aujourd'hui</p>
                    <p className="text-xl font-bold">127</p>
                    <p className="text-xs text-green-600">+12% vs hier</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Volume du jour</p>
                    <p className="text-xl font-bold">847,000</p>
                    <p className="text-xs text-gray-500">FCFA</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">En attente</p>
                    <p className="text-xl font-bold">8</p>
                    <p className="text-xs text-gray-500">Validation requise</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Taux d'échec</p>
                    <p className="text-xl font-bold">2.1%</p>
                    <p className="text-xs text-red-600">-0.3% vs hier</p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
                <CardDescription>Historique des paiements et retraits</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tontine</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.user}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.type === 'payment' ? (
                              <>
                                <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                                Paiement
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                                Retrait
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.tontine}</TableCell>
                        <TableCell>{transaction.amount} FCFA</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                            {transaction.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                             transaction.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : 
                             <XCircle className="w-3 h-3 mr-1" />}
                            {transaction.status === 'completed' ? 'Terminé' : transaction.status === 'pending' ? 'En cours' : 'Échec'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleString('fr-FR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {transaction.status === 'pending' && (
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres système</CardTitle>
                  <CardDescription>Configuration générale de la plateforme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Nom de la plateforme</Label>
                    <Input id="platform-name" defaultValue="Tontine Digital" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Email de support</Label>
                    <Input id="support-email" type="email" defaultValue="support@tontine.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-participants">Participants max par tontine</Label>
                    <Input id="max-participants" type="number" defaultValue="50" />
                  </div>
                  <Button>Sauvegarder les paramètres</Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Paramètres de sécurité et d'authentification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Durée de session (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">Politique de mot de passe</Label>
                    <Select defaultValue="strong">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="medium">Moyen</SelectItem>
                        <SelectItem value="strong">Fort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Authentification à deux facteurs</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="2fa" defaultChecked />
                      <Label htmlFor="2fa">Obligatoire pour les admins</Label>
                    </div>
                  </div>
                  <Button>Appliquer les changements</Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Outils d'administration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="w-6 h-6 mb-2" />
                    Exporter toutes les données
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <RefreshCw className="w-6 h-6 mb-2" />
                    Synchroniser les données
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    Importer utilisateurs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}