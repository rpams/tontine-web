"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateTontineForm } from "@/components/dashboard/CreateTontineForm";
import { cn } from "@/lib/utils";
import TontineDetailsModal from "@/components/admin/TontineDetailsModal";
import CreatePaymentModal from "@/components/admin/CreatePaymentModal";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminSkeleton from "@/components/skeletons/AdminSkeleton";
import { ValidationModal } from "@/components/admin/ValidationModal";
import { useAdminStats, useAdminUsers, useAdminTontines, useAdminPayments, useAdminPendingValidations, useReviewIdentityVerification, useUpdateUserStatus } from "@/lib/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Crown,
  Zap,
  UserCheck,
  Check,
  ChevronsUpDown,
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
  X,
  Loader2
} from "lucide-react";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";

function AdminPanelContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [usersPage, setUsersPage] = useState(0);
  const [tontineDetailsModal, setTontineDetailsModal] = useState(false);
  const [selectedTontineForDetails, setSelectedTontineForDetails] = useState<any>(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<any>(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<any>(null);
  const [showStatusToggleConfirm, setShowStatusToggleConfirm] = useState(false);

  // States pour la pagination des tontines
  const [tontinesPage, setTontinesPage] = useState(0);
  const [tontineSearchInput, setTontineSearchInput] = useState(""); // Filtre côté client
  const [tontineFilterStatus, setTontineFilterStatus] = useState("all");

  // States pour la pagination des paiements
  const [paymentsPage, setPaymentsPage] = useState(0);
  const [paymentSearchInput, setPaymentSearchInput] = useState(""); // Filtre côté client
  const [paymentFilterStatus, setPaymentFilterStatus] = useState("all");

  const USERS_PER_PAGE = 20;
  const TONTINES_PER_PAGE = 20;
  const PAYMENTS_PER_PAGE = 20;

  // Hooks pour récupérer les données
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ limit: 5 });
  const { data: tontinesData, isLoading: tontinesLoading } = useAdminTontines({ limit: 5 });
  const { data: paymentsData, isLoading: paymentsLoading } = useAdminPayments({ limit: 5 });
  const { data: validationsData, isLoading: validationsLoading } = useAdminPendingValidations();

  // Hook pour la révision des vérifications d'identité
  const reviewVerification = useReviewIdentityVerification();

  // Hook pour mettre à jour le statut d'un utilisateur
  const updateUserStatus = useUpdateUserStatus();

  // Handler pour la révision des vérifications
  const handleReviewVerification = async (verificationId: string, action: 'approve' | 'reject', message?: string) => {
    await reviewVerification.mutateAsync({ verificationId, action, message });
  };

  // Handler pour bloquer/débloquer un utilisateur
  const handleToggleUserStatus = (user: any) => {
    setUserToToggleStatus(user);
    setShowStatusToggleConfirm(true);
  };

  // Confirmer le blocage/déblocage
  const confirmToggleUserStatus = async () => {
    if (!userToToggleStatus) return;

    const action = userToToggleStatus.status === 'active' ? 'suspend' : 'activate';

    try {
      await updateUserStatus.mutateAsync({
        userId: userToToggleStatus.id,
        action
      });

      toast.success(
        action === 'suspend'
          ? `${userToToggleStatus.name} a été bloqué avec succès`
          : `${userToToggleStatus.name} a été débloqué avec succès`
      );
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error('Erreur lors du changement de statut de l\'utilisateur');
    } finally {
      // Fermer le modal seulement après la fin de la requête (succès ou erreur)
      setShowStatusToggleConfirm(false);
      setUserToToggleStatus(null);
    }
  };

  // Hook dédié pour l'onglet utilisateurs avec plus de données
  const { data: allUsersData, isLoading: allUsersLoading } = useAdminUsers({
    limit: USERS_PER_PAGE,
    offset: usersPage * USERS_PER_PAGE,
    search: searchTerm,
    status: filterStatus
  });

  // Hook pour récupérer TOUTES les tontines (sans pagination, on filtre côté client)
  const { data: allTontinesData, isLoading: allTontinesLoading } = useAdminTontines({
    limit: 1000, // Grande limite pour récupérer toutes les tontines
    offset: 0,
    search: '',
    status: 'all'
  });

  // Hook pour récupérer TOUS les paiements (sans pagination, on filtre côté client)
  const { data: allPaymentsData, isLoading: allPaymentsLoading } = useAdminPayments({
    limit: 1000, // Grande limite pour récupérer tous les paiements
    offset: 0,
    status: 'all'
  });

  // Reset pagination when search or filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setUsersPage(0);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setUsersPage(0);
  };

  // Filtrer les tontines côté client
  const filteredTontines = (allTontinesData?.tontines || []).filter((tontine: any) => {
    // Filtre par recherche (nom ou description)
    const matchesSearch = !tontineSearchInput ||
      tontine.name?.toLowerCase().includes(tontineSearchInput.toLowerCase()) ||
      tontine.description?.toLowerCase().includes(tontineSearchInput.toLowerCase());

    // Filtre par statut
    const matchesStatus = tontineFilterStatus === 'all' || tontine.status === tontineFilterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination côté client
  const paginatedTontines = filteredTontines.slice(
    tontinesPage * TONTINES_PER_PAGE,
    (tontinesPage + 1) * TONTINES_PER_PAGE
  );

  const totalTontinesPages = Math.ceil(filteredTontines.length / TONTINES_PER_PAGE);

  // Handlers pour les tontines
  const handleTontineSearchChange = (value: string) => {
    setTontineSearchInput(value);
    setTontinesPage(0); // Reset à la page 1
  };

  const handleTontineFilterChange = (value: string) => {
    setTontineFilterStatus(value);
    setTontinesPage(0);
  };

  // Filtrer les paiements côté client
  const filteredPayments = (allPaymentsData?.payments || []).filter((payment: any) => {
    // Filtre par recherche (utilisateur, tontine, référence, montant)
    const matchesSearch = !paymentSearchInput ||
      payment.user?.name?.toLowerCase().includes(paymentSearchInput.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(paymentSearchInput.toLowerCase()) ||
      payment.tontine?.name?.toLowerCase().includes(paymentSearchInput.toLowerCase()) ||
      payment.amount?.toString().includes(paymentSearchInput);

    // Filtre par statut
    const matchesStatus = paymentFilterStatus === 'all' || payment.status === paymentFilterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination côté client pour les paiements
  const paginatedPayments = filteredPayments.slice(
    paymentsPage * PAYMENTS_PER_PAGE,
    (paymentsPage + 1) * PAYMENTS_PER_PAGE
  );

  const totalPaymentsPages = Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE);

  // Handlers pour les paiements
  const handlePaymentSearchChange = (value: string) => {
    setPaymentSearchInput(value);
    setPaymentsPage(0); // Reset à la page 1
  };

  const handlePaymentFilterChange = (value: string) => {
    setPaymentFilterStatus(value);
    setPaymentsPage(0);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (usersPage > 0) {
      setUsersPage(usersPage - 1);
    }
  };

  const handleNextPage = () => {
    if (allUsersData?.pagination?.hasMore) {
      setUsersPage(usersPage + 1);
    }
  };

  // Calculate pagination info
  const startItem = usersPage * USERS_PER_PAGE + 1;
  const endItem = Math.min((usersPage + 1) * USERS_PER_PAGE, allUsersData?.pagination?.total || 0);
  const totalItems = allUsersData?.pagination?.total || 0;
  const currentPage = usersPage + 1;
  const totalPages = Math.ceil(totalItems / USERS_PER_PAGE);

  // Afficher le skeleton si les données principales sont en cours de chargement
  if (statsLoading || !statsData) {
    return <AdminSkeleton />;
  }

  const stats = statsData.stats;

  const recentUsers = usersData?.users || [];

  const recentTontines = tontinesData?.tontines || [];

  const recentTransactions = paymentsData?.payments || [];

  const pendingValidations = validationsData?.validations || [];

  return (
    <div className="min-h-screen bg-stone-100/90 relative" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      {/* Admin Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Cpath d='M30 15l15 15-15 15-15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}>
        </div>
      </div>


      <div className="relative z-10">
        <NavbarDashboard
          userName="Admin"
          userEmail="admin@tontine.app"
        />
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-12 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="font-bold">ADMIN</span>
                  <Crown className="w-4 h-4 ml-1" />
                </Badge>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <Bell className="w-3 h-3 mr-1" />
                {stats.pendingVerifications}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* Admin Info Block */}
        <div className="bg-white border border-red-500 p-3 rounded-lg mb-4 max-w-full sm:max-w-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img 
                  src="/avatars/avatar-jkjnlef.svg" 
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

        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
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

        {/* Navigation Section */}
        <div className="mb-8">
          <div className="w-full bg-white border rounded-lg p-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className={`flex items-center transition-all duration-300 ${
                  activeTab === "overview" ? 
                  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md" : 
                  "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Tableau de bord
                {activeTab === "overview" && <Zap className="w-3 h-3 ml-1 animate-pulse" />}
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center transition-all duration-300 ${
                  activeTab === "analytics" ?
                  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md" :
                  "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                }`}
              >
                <Activity className="w-4 h-4 mr-2" />
                Analytics
                {activeTab === "analytics" && <Zap className="w-3 h-3 ml-1 animate-pulse" />}
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("users")}
                className={`flex items-center transition-all duration-300 ${
                  activeTab === "users" ? 
                  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md" : 
                  "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Utilisateurs
                {activeTab === "users" && <Zap className="w-3 h-3 ml-1 animate-pulse" />}
              </Button>
              <Button
                variant={activeTab === "tontines" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("tontines")}
                className={`flex items-center transition-all duration-300 ${
                  activeTab === "tontines" ? 
                  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md" : 
                  "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Tontines
                {activeTab === "tontines" && <Zap className="w-3 h-3 ml-1 animate-pulse" />}
              </Button>
              <Button
                variant={activeTab === "payments" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("payments")}
                className={`flex items-center transition-all duration-300 ${
                  activeTab === "payments" ? 
                  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md" : 
                  "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                }`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Paiements
                {activeTab === "payments" && <Zap className="w-3 h-3 ml-1 animate-pulse" />}
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("settings")}
                className={`flex items-center transition-all duration-300 ${
                  activeTab === "settings" ?
                  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md" :
                  "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
                {activeTab === "settings" && <Zap className="w-3 h-3 ml-1 animate-pulse" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
              <p className="text-gray-600">Vue d'ensemble des activités et performances de la plateforme</p>
            </div>
            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Utilisateurs totaux</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 truncate">+{stats.newUsersThisWeek} cette semaine</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Tontines actives</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.activeTontines}</p>
                    <p className="text-xs text-gray-500 truncate">sur {stats.totalTontines} au total</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Transactions</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 truncate">Volume total traité</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Revenus totaux (CFA)</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.totalRevenue}</p>
                    <p className="text-xs text-gray-500 truncate">Depuis le lancement</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
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
                <CardContent className="px-3 sm:px-4 lg:px-6">
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
                        {validationsLoading ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                <span>Chargement...</span>
                              </div>
                            </td>
                          </tr>
                        ) : pendingValidations.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              Aucune validation en attente
                            </td>
                          </tr>
                        ) : pendingValidations.map((user, index) => (
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
                              <ValidationModal
                                user={user}
                                onReview={handleReviewVerification}
                                isLoading={reviewVerification.isPending}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-3">
                    {validationsLoading ? (
                      <div className="py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                          <span>Chargement...</span>
                        </div>
                      </div>
                    ) : pendingValidations.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">
                        Aucune validation en attente
                      </div>
                    ) : pendingValidations.map((user, index) => (
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
                          <ValidationModal
                            user={user}
                            onReview={handleReviewVerification}
                            isLoading={reviewVerification.isPending}
                          />
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
                            <p className="text-sm font-medium">{transaction.user.name}</p>
                            <DollarSign className="w-3 h-3 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-500">{transaction.amount} FCFA • {transaction.tontine.name}</p>
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
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h2>
              <p className="text-gray-600">Administration et modération des comptes utilisateurs de la plateforme</p>
            </div>
            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search et Filter - première ligne */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 bg-white">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select value={filterStatus} onValueChange={handleFilterChange}>
                    <SelectTrigger className="flex-1 sm:w-40 bg-white">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="suspended">Suspendus</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex-shrink-0 px-3">
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                </div>
              </div>
              
              {/* Actions - deuxième ligne */}
              {/* <div className="flex justify-end">
                <Button className="w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </div> */}
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <CardTitle className="text-lg">Gestion des utilisateurs</CardTitle>
                    <CardDescription>Liste de tous les utilisateurs de la plateforme</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="whitespace-nowrap">Actifs: {allUsersData?.users?.filter(u => u.status === 'active').length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="whitespace-nowrap">Suspendus: {allUsersData?.users?.filter(u => u.status === 'suspended').length || 0}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 lg:px-6">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Utilisateur</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Inscription</TableHead>
                        <TableHead className="font-semibold">Tontines</TableHead>
                        <TableHead className="font-semibold">Vérifications</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsersLoading ? (
                        // Skeleton rows
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                <div>
                                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                                  <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-8 w-20 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                          </TableRow>
                        ))
                      ) : allUsersData?.users && allUsersData.users.length > 0 ? (
                        allUsersData.users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50">
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
                                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                {user.verified && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <BadgeCheck className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900">{user.name}</p>
                                  {user.status === 'suspended' && (
                                    <Ban className="w-4 h-4 text-red-600" />
                                  )}
                                  {user.status === 'active' && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant={user.status === 'active' ? 'default' : 'destructive'}
                              className={
                                user.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                                'bg-red-100 text-red-800 border-red-300'
                              }
                            >
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                <div className="animate-ping rounded-full w-2 h-2"></div>
                              </div>
                              {user.status === 'active' ? 'Actif' : 'Suspendu'}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-gray-500">
                                Il y a {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-blue-600" />
                                <span className="text-sm font-medium">{user.stats.ownedTontines + user.stats.participantTontines}</span>
                              </div>
                              <span className="text-xs text-gray-500">tontines</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                {user.verified ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-700 font-medium">Email vérifié</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 text-yellow-600" />
                                    <span className="text-xs text-yellow-700 font-medium">Email non vérifié</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {user.identityVerificationStatus === 'APPROVED' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-700 font-medium">Document vérifié</span>
                                  </>
                                ) : user.identityVerificationStatus === 'PENDING' ? (
                                  <>
                                    <Clock className="w-3 h-3 text-blue-600" />
                                    <span className="text-xs text-blue-700 font-medium">Document en attente</span>
                                  </>
                                ) : user.identityVerificationStatus === 'REJECTED' ? (
                                  <>
                                    <XCircle className="w-3 h-3 text-red-600" />
                                    <span className="text-xs text-red-700 font-medium">Document rejeté</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 text-gray-600" />
                                    <span className="text-xs text-gray-700 font-medium">Document manquant</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => {
                                  setSelectedUserForDetails(user);
                                  setUserDetailsModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50"
                                onClick={() => handleToggleUserStatus(user)}
                                disabled={updateUserStatus.isPending && userToToggleStatus?.id === user.id}
                              >
                                {updateUserStatus.isPending && userToToggleStatus?.id === user.id ? (
                                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                ) : user.status === 'suspended' ? (
                                  <UserCheck className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Ban className="w-4 h-4 text-red-600" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <Users className="w-12 h-12 text-gray-400 mb-4" />
                              <p className="text-gray-500 text-lg mb-2">Aucun utilisateur trouvé</p>
                              <p className="text-gray-400 text-sm">
                                {searchTerm || filterStatus !== 'all'
                                  ? 'Essayez de modifier vos critères de recherche'
                                  : 'Aucun utilisateur enregistré pour le moment'
                                }
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {allUsersLoading ? (
                    // Skeleton cards for mobile
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : allUsersData?.users && allUsersData.users.length > 0 ? (
                    allUsersData.users.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            {user.verified && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <BadgeCheck className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {user.status === 'suspended' && (
                                <Ban className="w-4 h-4 text-red-600" />
                              )}
                              <h4 className="font-semibold text-gray-900">{user.name}</h4>
                              {user.status === 'active' && (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Inscrit le {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'destructive'}
                          className={`${
                            user.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {user.status === 'active' ? 'Actif' : 'Suspendu'}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            <span className="text-sm font-medium">{user.stats.ownedTontines + user.stats.participantTontines} tontines</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            {user.verified ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-green-700">Email vérifié</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-yellow-600" />
                                <span className="text-yellow-700">Email non vérifié</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {user.identityVerificationStatus === 'APPROVED' ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-green-700">Document vérifié</span>
                              </>
                            ) : user.identityVerificationStatus === 'PENDING' ? (
                              <>
                                <Clock className="w-3 h-3 text-blue-600" />
                                <span className="text-blue-700">Document en attente</span>
                              </>
                            ) : user.identityVerificationStatus === 'REJECTED' ? (
                              <>
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span className="text-red-700">Document rejeté</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-gray-600" />
                                <span className="text-gray-700">Document manquant</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedUserForDetails(user);
                            setUserDetailsModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleToggleUserStatus(user)}
                          disabled={updateUserStatus.isPending && userToToggleStatus?.id === user.id}
                        >
                          {updateUserStatus.isPending && userToToggleStatus?.id === user.id ? (
                            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                          ) : user.status === 'suspended' ? (
                            <UserCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <Ban className="w-4 h-4 text-red-600" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">Aucun utilisateur trouvé</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Essayez de modifier vos critères de recherche'
                          : 'Aucun utilisateur enregistré pour le moment'
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-6 border-t gap-4">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Affichage de {totalItems > 0 ? startItem : 0} à {endItem} sur {totalItems} utilisateurs
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={usersPage === 0 || allUsersLoading}
                      onClick={handlePreviousPage}
                      className="hidden sm:flex"
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={usersPage === 0 || allUsersLoading}
                      onClick={handlePreviousPage}
                      className="sm:hidden w-8 h-8 p-0"
                    >
                      ←
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600 px-2">
                        Page {currentPage} sur {totalPages || 1}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!allUsersData?.pagination?.hasMore || allUsersLoading}
                      onClick={handleNextPage}
                      className="hidden sm:flex"
                    >
                      Suivant
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!allUsersData?.pagination?.hasMore || allUsersLoading}
                      onClick={handleNextPage}
                      className="sm:hidden w-8 h-8 p-0"
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tontines" && (
          <div className="space-y-6">
            {/* Header avec bouton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des tontines</h2>
                <p className="text-gray-600">Administrez et surveillez toutes les tontines de la plateforme</p>
              </div>
              <div className="flex-shrink-0">
                <CreateTontineForm />
              </div>
            </div>

            {/* Tontines Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Tontines actives</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.activeTontines}</p>
                    <p className="text-xs text-gray-500 truncate">Cycles en cours</p>
                  </div>
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">En attente</p>
                    <p className="text-lg sm:text-xl font-bold">12</p>
                    <p className="text-xs text-gray-500 truncate">Validation nécessaire</p>
                  </div>
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-3 sm:p-4 rounded-md col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Terminées</p>
                    <p className="text-lg sm:text-xl font-bold">55</p>
                    <p className="text-xs text-gray-500 truncate">Cycles complétés</p>
                  </div>
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Tontines Table */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">Gestion des tontines</CardTitle>
                      <CardDescription>Liste de toutes les tontines créées sur la plateforme</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="whitespace-nowrap">Actives: {filteredTontines.filter((t: any) => t.status === 'ACTIVE').length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="whitespace-nowrap">Terminées: {filteredTontines.filter((t: any) => t.status === 'COMPLETED').length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Filtres de recherche */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une tontine..."
                        value={tontineSearchInput}
                        onChange={(e) => handleTontineSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={tontineFilterStatus} onValueChange={handleTontineFilterChange}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="ACTIVE">Actives</SelectItem>
                        <SelectItem value="COMPLETED">Terminées</SelectItem>
                        <SelectItem value="CANCELLED">Annulées</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 lg:px-6">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Tontine</TableHead>
                        <TableHead className="font-semibold">Participants</TableHead>
                        <TableHead className="font-semibold">Montant</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Progression</TableHead>
                        <TableHead className="font-semibold">Création</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allTontinesLoading ? (
                        // Skeleton rows
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-8 w-20 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                          </TableRow>
                        ))
                      ) : paginatedTontines.length > 0 ? (
                        paginatedTontines.map((tontine: any) => (
                        <TableRow key={tontine.id} className="hover:bg-gray-50/50">
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900">{tontine.name}</p>
                                  {tontine.status === 'active' && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <p className="text-sm text-gray-600">{tontine.creator?.name}</p>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-gray-900">{tontine.stats?.participantCount}</span>
                              </div>
                              <span className="text-xs text-gray-500">membres</span>
                            </div>
                            <div className="flex -space-x-1 mt-1">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-300"></div>
                              ))}
                              {(tontine.stats?.participantCount || 0) > 3 && (
                                <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center">
                                  <span className="text-xs text-white font-medium">+{(tontine.stats?.participantCount || 0) - 3}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm">
                              <div className="font-bold text-gray-900 text-base">
                                {parseInt(tontine.amount).toLocaleString()} FCFA
                              </div>
                              <div className="text-gray-500 text-xs">
                                {Math.round(parseInt(tontine.amount) / (tontine.stats?.participantCount || 1)).toLocaleString()} FCFA/pers
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge 
                              variant={tontine.status === 'active' ? 'default' : tontine.status === 'completed' ? 'secondary' : 'outline'}
                              className={`${
                                tontine.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                                tontine.status === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-300' :
                                'bg-yellow-100 text-yellow-800 border-yellow-300'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                tontine.status === 'active' ? 'bg-green-500' :
                                tontine.status === 'completed' ? 'bg-gray-500' : 'bg-yellow-500'
                              }`}></div>
                              {tontine.status === 'active' ? 'Active' : tontine.status === 'completed' ? 'Terminée' : 'En attente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Tours</span>
                                <span className="font-medium">
                                  {tontine.currentRound}/{tontine.totalRounds}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    tontine.status === 'completed' ? 'bg-gray-500' : 'bg-blue-500'
                                  }`}
                                  style={{
                                    width: `${tontine.stats?.completionRate || 0}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {new Date(tontine.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-gray-500">
                                Il y a {Math.floor((Date.now() - new Date(tontine.createdAt).getTime()) / (1000 * 60 * 60 * 24))} jours
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => {
                                  setSelectedTontineForDetails(tontine);
                                  setTontineDetailsModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
                                <MoreHorizontal className="w-4 h-4 text-gray-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">Aucune tontine trouvée</p>
                            <p className="text-gray-400 text-sm">
                              {tontineSearchInput || tontineFilterStatus !== 'all'
                                ? 'Essayez de modifier vos filtres de recherche'
                                : 'Créez votre première tontine pour commencer'}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {allTontinesLoading ? (
                    // Skeleton cards for mobile
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : paginatedTontines.length > 0 ? (
                    paginatedTontines.map((tontine: any) => (
                    <div key={tontine.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{tontine.name}</h4>
                              {tontine.status === 'active' && (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-600">{tontine.creator.name}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Créée le {new Date(tontine.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={tontine.status === 'active' ? 'default' : tontine.status === 'completed' ? 'secondary' : 'outline'}
                          className={`${
                            tontine.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                            tontine.status === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-300' :
                            'bg-yellow-100 text-yellow-800 border-yellow-300'
                          }`}
                        >
                          {tontine.status === 'active' ? 'Active' : tontine.status === 'completed' ? 'Terminée' : 'En attente'}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-blue-600" />
                              <span className="font-medium">{tontine.stats?.participantCount || 0} membres</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-green-600" />
                              <span className="font-medium">{parseInt(tontine.amount).toLocaleString()} FCFA</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Progression des tours</span>
                            <span className="font-medium">
                              {tontine.currentRound}/{tontine.totalRounds}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                tontine.status === 'completed' ? 'bg-gray-500' : 'bg-blue-500'
                              }`}
                              style={{
                                width: `${tontine.stats?.completionRate || 0}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-300"></div>
                            ))}
                            {(tontine.stats?.participantCount || 0) > 3 && (
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">+{(tontine.stats?.participantCount || 0) - 3}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedTontineForDetails(tontine);
                                setTontineDetailsModal(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
                              <MoreHorizontal className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">Aucune tontine trouvée</p>
                      <p className="text-gray-400 text-sm">
                        {tontineSearchInput || tontineFilterStatus !== 'all'
                          ? 'Essayez de modifier vos filtres de recherche'
                          : 'Créez votre première tontine pour commencer'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {filteredTontines.length > 0 && totalTontinesPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-6 border-t gap-4">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Affichage de {tontinesPage * TONTINES_PER_PAGE + 1} à{' '}
                    {Math.min((tontinesPage + 1) * TONTINES_PER_PAGE, filteredTontines.length)} sur{' '}
                    {filteredTontines.length} tontines
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={tontinesPage === 0}
                      onClick={() => setTontinesPage(p => Math.max(0, p - 1))}
                      className="hidden sm:flex">
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={tontinesPage === 0}
                      onClick={() => setTontinesPage(p => Math.max(0, p - 1))}
                      className="sm:hidden w-8 h-8 p-0"
                    >
                      ←
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">
                        Page {tontinesPage + 1} sur {totalTontinesPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={tontinesPage >= totalTontinesPages - 1}
                      onClick={() => setTontinesPage(p => p + 1)}
                      className="hidden sm:flex"
                    >
                      Suivant
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={tontinesPage >= totalTontinesPages - 1}
                      onClick={() => setTontinesPage(p => p + 1)}
                      className="sm:hidden w-8 h-8 p-0"
                    >
                      →
                    </Button>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des paiements</h2>
              <p className="text-gray-600">Supervision et administration de toutes les transactions financières</p>
            </div>
            {/* Payment Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Transactions aujourd'hui</p>
                    <p className="text-lg sm:text-xl font-bold">127</p>
                    <p className="text-xs text-green-600 truncate">+12% vs hier</p>
                  </div>
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Volume du jour</p>
                    <p className="text-lg sm:text-xl font-bold">847,000</p>
                    <p className="text-xs text-gray-500 truncate">FCFA</p>
                  </div>
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">En attente</p>
                    <p className="text-lg sm:text-xl font-bold">8</p>
                    <p className="text-xs text-gray-500 truncate">Validation requise</p>
                  </div>
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-3 sm:p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">Taux d'échec</p>
                    <p className="text-lg sm:text-xl font-bold">2.1%</p>
                    <p className="text-xs text-red-600 truncate">-0.3% vs hier</p>
                  </div>
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Gestion des transactions</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Historique complet des paiements et retraits</CardDescription>
                    </div>
                    <div className="self-start sm:self-center flex-shrink-0">
                      <CreatePaymentModal />
                    </div>
                  </div>

                  {/* Filtres de recherche */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher par nom, email, tontine ou montant..."
                        value={paymentSearchInput}
                        onChange={handlePaymentSearchChange}
                        className="pl-10 h-10"
                      />
                    </div>
                    <Select value={paymentFilterStatus} onValueChange={handlePaymentFilterChange}>
                      <SelectTrigger className="w-full sm:w-48 h-10">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="paid">Payés</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="failed">Échecs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="whitespace-nowrap">Terminées: {filteredPayments.filter(t => t.status === 'PAID').length}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="whitespace-nowrap">En attente: {filteredPayments.filter(t => t.status === 'PENDING').length}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="whitespace-nowrap">Échecs: {filteredPayments.filter(t => t.status === 'FAILED').length}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 lg:px-6">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Tontine</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPaymentsLoading ? (
                        // Skeleton rows
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                                <div>
                                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                                  <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                                <div>
                                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-1"></div>
                                  <div className="h-3 w-12 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : paginatedPayments.length > 0 ? (
                        paginatedPayments.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={transaction.user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {transaction.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{transaction.user.name}</div>
                                <div className="text-xs text-gray-500">ID: {transaction.id.toString().padStart(6, '0')}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">Paiement</div>
                                <div className="text-xs text-gray-500">Tour {transaction.round}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{transaction.tontine.name}</div>
                            <div className="text-xs text-gray-500">Statut: {transaction.tontine.status}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-bold text-gray-900">{transaction.amount} FCFA</div>
                            <div className="text-xs text-gray-500">
                              Round {transaction.round}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                transaction.status === 'PAID'
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : transaction.status === 'PENDING'
                                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                transaction.status === 'PAID'
                                  ? 'bg-green-500'
                                  : transaction.status === 'PENDING' 
                                  ? 'bg-orange-500 animate-pulse' 
                                  : 'bg-red-500'
                              }`}></div>
                              {transaction.status === 'PAID' ? 'Payé' :
                               transaction.status === 'PENDING' ? 'En attente' : 'Échec'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{new Date(transaction.createdAt).toLocaleDateString('fr-FR')}</div>
                            <div className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {transaction.status === 'pending' && (
                                <>
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">Aucun paiement trouvé</p>
                            <p className="text-gray-400 text-sm">
                              {paymentSearchInput || paymentFilterStatus !== 'all'
                                ? 'Essayez de modifier vos filtres de recherche'
                                : 'Aucun paiement enregistré pour le moment'}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3">
                  {allPaymentsLoading ? (
                    // Skeleton cards for mobile
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                            <div>
                              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                          </div>
                          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
                            <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : paginatedPayments.length > 0 ? (
                    paginatedPayments.map((transaction) => (
                    <Card key={transaction.id} className="p-4 rounded-md border hover:shadow-sm transition-shadow">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={`/avatars/avatar-${transaction.id}.svg`} />
                              <AvatarFallback className="text-sm">
                                {transaction.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{transaction.user.name}</div>
                              <div className="text-xs text-gray-500">ID: {transaction.id.toString().padStart(6, '0')}</div>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : transaction.status === 'pending' 
                                ? 'bg-orange-100 text-orange-800 border-orange-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              transaction.status === 'completed' 
                                ? 'bg-green-500' 
                                : transaction.status === 'pending' 
                                ? 'bg-orange-500 animate-pulse' 
                                : 'bg-red-500'
                            }`}></div>
                            {transaction.status === 'completed' ? 'Terminé' : 
                             transaction.status === 'pending' ? 'En cours' : 'Échec'}
                          </Badge>
                        </div>

                        {/* Transaction Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              Paiement - Round {transaction.round}
                            </div>
                            <div className="text-xs text-gray-500">{transaction.tontine.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">{transaction.amount} FCFA</div>
                            <div className="text-xs text-gray-500">
                              {transaction.user.name}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('fr-FR')} à {new Date(transaction.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {transaction.status === 'pending' && (
                              <>
                                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">Aucun paiement trouvé</p>
                      <p className="text-gray-400 text-sm">
                        {paymentSearchInput || paymentFilterStatus !== 'all'
                          ? 'Essayez de modifier vos filtres de recherche'
                          : 'Aucun paiement enregistré pour le moment'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {filteredPayments.length > 0 && totalPaymentsPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-6 border-t gap-4">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Affichage de {paymentsPage * PAYMENTS_PER_PAGE + 1} à{' '}
                    {Math.min((paymentsPage + 1) * PAYMENTS_PER_PAGE, filteredPayments.length)} sur{' '}
                    {filteredPayments.length} paiements
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paymentsPage === 0}
                      onClick={() => setPaymentsPage(p => Math.max(0, p - 1))}
                      className="hidden sm:flex">
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paymentsPage === 0}
                      onClick={() => setPaymentsPage(p => Math.max(0, p - 1))}
                      className="sm:hidden w-8 h-8 p-0"
                    >
                      ←
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">
                        Page {paymentsPage + 1} sur {totalPaymentsPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paymentsPage >= totalPaymentsPages - 1}
                      onClick={() => setPaymentsPage(p => p + 1)}
                      className="hidden sm:flex"
                    >
                      Suivant
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paymentsPage >= totalPaymentsPages - 1}
                      onClick={() => setPaymentsPage(p => p + 1)}
                      className="sm:hidden w-8 h-8 p-0"
                    >
                      →
                    </Button>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}


        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paramètres système</h2>
              <p className="text-gray-600">Configuration et administration des paramètres de la plateforme</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                  <CardDescription>Configuration générale de la plateforme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Email de support</Label>
                    <Input id="support-email" type="email" defaultValue="support@tontine.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-timezone">Fuseau horaire</Label>
                    <Select defaultValue="africa/abidjan">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa/abidjan">Afrique/Abidjan (GMT)</SelectItem>
                        <SelectItem value="africa/casablanca">Afrique/Casablanca (GMT+1)</SelectItem>
                        <SelectItem value="africa/lagos">Afrique/Lagos (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-mode">Mode maintenance</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="maintenance-mode" />
                      <Label htmlFor="maintenance-mode">Activer le mode maintenance</Label>
                    </div>
                  </div>
                  <Button>Sauvegarder les paramètres</Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Paramètres de sécurité et vérification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Vérification d'identité</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="id-verification" defaultChecked />
                        <Label htmlFor="id-verification">Obligatoire pour créer une tontine</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="phone-verification" defaultChecked />
                        <Label htmlFor="phone-verification">Vérification téléphone obligatoire</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-rate-limit">Limite de requêtes API (par minute)</Label>
                    <Input id="api-rate-limit" type="number" defaultValue="100" />
                  </div>
                  <Button>Appliquer les changements</Button>
                </CardContent>
              </Card>
            </div>

            {/* Geographic Access Control */}
            <Card>
              <CardHeader>
                <CardTitle>Accès géographique</CardTitle>
                <CardDescription>Gestion des pays autorisés à utiliser la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country-search">Ajouter un pays autorisé</Label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          id="country-search"
                          placeholder="Rechercher un pays..."
                          list="countries-list"
                        />
                        <datalist id="countries-list">
                          {/* Afrique de l'Ouest */}
                          <option value="Bénin" />
                          <option value="Burkina Faso" />
                          <option value="Cap-Vert" />
                          <option value="Côte d'Ivoire" />
                          <option value="Gambie" />
                          <option value="Ghana" />
                          <option value="Guinée" />
                          <option value="Guinée-Bissau" />
                          <option value="Liberia" />
                          <option value="Mali" />
                          <option value="Mauritanie" />
                          <option value="Niger" />
                          <option value="Nigeria" />
                          <option value="Sénégal" />
                          <option value="Sierra Leone" />
                          <option value="Togo" />

                          {/* Afrique Centrale */}
                          <option value="Cameroun" />
                          <option value="République Centrafricaine" />
                          <option value="Tchad" />
                          <option value="République Démocratique du Congo" />
                          <option value="République du Congo" />
                          <option value="Guinée Équatoriale" />
                          <option value="Gabon" />
                          <option value="São Tomé-et-Príncipe" />

                          {/* Afrique de l'Est */}
                          <option value="Burundi" />
                          <option value="Comores" />
                          <option value="Djibouti" />
                          <option value="Érythrée" />
                          <option value="Éthiopie" />
                          <option value="Kenya" />
                          <option value="Madagascar" />
                          <option value="Malawi" />
                          <option value="Maurice" />
                          <option value="Mozambique" />
                          <option value="Rwanda" />
                          <option value="Seychelles" />
                          <option value="Somalie" />
                          <option value="Soudan du Sud" />
                          <option value="Soudan" />
                          <option value="Tanzanie" />
                          <option value="Ouganda" />
                          <option value="Zambie" />
                          <option value="Zimbabwe" />

                          {/* Afrique du Nord */}
                          <option value="Algérie" />
                          <option value="Égypte" />
                          <option value="Libye" />
                          <option value="Maroc" />
                          <option value="Tunisie" />

                          {/* Afrique Australe */}
                          <option value="Afrique du Sud" />
                          <option value="Angola" />
                          <option value="Botswana" />
                          <option value="Eswatini" />
                          <option value="Lesotho" />
                          <option value="Namibie" />

                          {/* Europe */}
                          <option value="France" />
                          <option value="Belgique" />
                          <option value="Suisse" />
                          <option value="Canada" />

                          {/* Autres */}
                          <option value="Haïti" />
                        </datalist>
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pays actuellement autorisés</Label>
                    <div className="border rounded-lg p-4 min-h-[80px]">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm flex items-center gap-2">
                          🇧🇯 Bénin
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-green-700 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                        {/* Les autres pays seront ajoutés ici dynamiquement */}
                      </div>
                      {/* Message quand aucun pays n'est ajouté */}
                      <div className="hidden text-gray-500 text-sm text-center py-4">
                        Aucun pays supplémentaire ajouté
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">Restriction géographique</p>
                      <p className="text-xs text-gray-500">Bloquer l'accès depuis les pays non autorisés</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="geo-restriction" defaultChecked />
                      <Label htmlFor="geo-restriction" className="text-sm">Activé</Label>
                    </div>
                  </div>
                  <Button className="mt-4">Sauvegarder les paramètres</Button>
                </div>
              </CardContent>
            </Card>

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

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
              <p className="text-gray-600">Analyses approfondies et métriques de performance de la plateforme</p>
            </div>
            {/* Analytics Overview - Détaillé */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>Aperçu Analytique</span>
                  </CardTitle>
                  <CardDescription>Métriques et tendances clés de la plateforme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Croissance utilisateurs</p>
                      <p className="text-2xl font-bold text-blue-900">+{stats.newUsersThisWeek}</p>
                      <p className="text-xs text-blue-600">cette semaine</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Taux d'activité</p>
                      <p className="text-2xl font-bold text-green-900">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}%</p>
                      <p className="text-xs text-green-600">utilisateurs actifs</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Utilisateurs totaux</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalUsers}</p>
                      <p className="text-xs text-purple-600">{stats.activeUsers} actifs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span>Analytics Tontines</span>
                  </CardTitle>
                  <CardDescription>Statistiques des tontines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Tontines totales</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalTontines}</p>
                      <p className="text-xs text-green-600">{stats.activeTontines} actives</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Taux de participation</span>
                        <span className="font-semibold">{Math.round((stats.activeTontines / stats.totalTontines) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.round((stats.activeTontines / stats.totalTontines) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vérifications en attente</span>
                        <span className="font-semibold text-orange-600">{stats.pendingVerifications}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${Math.min((stats.pendingVerifications / stats.totalUsers) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span>Rapport Financier</span>
                  </CardTitle>
                  <CardDescription>Métriques financières</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Revenu total</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalRevenue} FCFA</p>
                      <p className="text-xs text-purple-600">toutes transactions</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-indigo-600 font-medium">Transactions</p>
                      <p className="text-2xl font-bold text-indigo-900">{stats.totalTransactions}</p>
                      <p className="text-xs text-indigo-600">transactions totales</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Moyenne/transaction</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {Math.round(parseFloat(stats.totalRevenue.replace(/\s/g, '')) / stats.totalTransactions).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600">FCFA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides Analytics</CardTitle>
                <CardDescription>Raccourcis vers les rapports et analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2 text-blue-600" />
                    Rapport Utilisateurs
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="w-6 h-6 mb-2 text-orange-600" />
                    Tendances
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Footer */}
        {/*
        <footer className="mt-12 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-t border-purple-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Session Administrateur</p>
                  <p className="text-xs text-gray-500">Connecté depuis {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Système opérationnel
                </span>
                <span>v2.1.0</span>
                <span>© 2024 Tontine Admin</span>
              </div>
            </div>
          </div>
        </footer>
        */}
      </main>

      {/* Modal de détails de tontine */}
      <TontineDetailsModal
        open={tontineDetailsModal}
        onOpenChange={setTontineDetailsModal}
        tontine={selectedTontineForDetails}
      />

      {/* Modal de détails de l'utilisateur */}
      <UserDetailsModal
        open={userDetailsModal}
        onOpenChange={setUserDetailsModal}
        user={selectedUserForDetails}
      />

      {/* AlertDialog pour confirmer le blocage/déblocage d'utilisateur */}
      <AlertDialog open={showStatusToggleConfirm} onOpenChange={setShowStatusToggleConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggleStatus?.status === 'active' ? 'Bloquer l\'utilisateur' : 'Débloquer l\'utilisateur'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggleStatus?.status === 'active' ? (
                <>
                  Êtes-vous sûr de vouloir bloquer <span className="font-semibold">{userToToggleStatus?.name}</span> ?
                  <br /><br />
                  L'utilisateur ne pourra plus se connecter ni accéder à son compte.
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir débloquer <span className="font-semibold">{userToToggleStatus?.name}</span> ?
                  <br /><br />
                  L'utilisateur pourra à nouveau se connecter et accéder à son compte.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateUserStatus.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleUserStatus}
              disabled={updateUserStatus.isPending}
              className={userToToggleStatus?.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {updateUserStatus.isPending ? 'En cours...' : (userToToggleStatus?.status === 'active' ? 'Confirmer le blocage' : 'Confirmer le déblocage')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminLayout>
      <AdminPanelContent />
    </AdminLayout>
  );
}