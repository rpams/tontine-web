"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  Search,
  Filter,
  X,
  Trash2,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function Payments() {
  const payments = [
    {
      id: '001',
      tontine: 'Tontine Famille',
      amount: '85 000 FCFA',
      date: '2024-09-07',
      status: 'Payé',
      method: 'MTN Money',
      type: 'Contribution',
      description: 'Paiement tour 3 - Septembre 2024',
      reference: 'TF240907001',
      recipient: 'Marie KOUADIO'
    },
    {
      id: '002',
      tontine: 'Épargne Projet',
      amount: '120 000 FCFA',
      date: '2024-09-05',
      status: 'Reçu',
      method: 'KkiaPay',
      type: 'Gain',
      description: 'Réception tour 8 - Août 2024',
      reference: 'EP240905002',
      recipient: 'Vous'
    },
    {
      id: '003',
      tontine: 'Tontine Business',
      amount: '25 000 FCFA',
      date: '2024-09-10',
      status: 'En attente',
      method: 'Moov Money',
      type: 'Contribution',
      description: 'Paiement tour 2 - Septembre 2024',
      reference: 'TB240910003',
      recipient: 'Paul AGBODJI'
    },
    {
      id: '004',
      tontine: 'Épargne Éducation',
      amount: '45 000 FCFA',
      date: '2024-09-03',
      status: 'Échoué',
      method: 'FedaPay',
      type: 'Contribution',
      description: 'Tentative paiement tour 5 - Septembre 2024',
      reference: 'EE240903004',
      recipient: 'Fatou DIALLO'
    },
    {
      id: '005',
      tontine: 'Fonds Santé',
      amount: '75 000 FCFA',
      date: '2024-09-01',
      status: 'Payé',
      method: 'Visa',
      type: 'Contribution',
      description: 'Paiement tour 12 - Septembre 2024',
      reference: 'FS240901005',
      recipient: 'Dr. MENSAH'
    },
    {
      id: '006',
      tontine: 'Tontine Vacances',
      amount: '35 000 FCFA',
      date: '2024-08-28',
      status: 'Reçu',
      method: 'MTN Money',
      type: 'Gain',
      description: 'Réception tour 4 - Août 2024',
      reference: 'TV240828006',
      recipient: 'Vous'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Payé':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
      case 'Reçu':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: TrendingUp,
          iconColor: 'text-blue-500'
        };
      case 'En attente':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          iconColor: 'text-yellow-500'
        };
      case 'Échoué':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-500'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-500'
        };
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'Contribution':
        return {
          color: 'text-red-600',
          icon: TrendingDown,
          prefix: '-'
        };
      case 'Gain':
        return {
          color: 'text-green-600',
          icon: TrendingUp,
          prefix: '+'
        };
      default:
        return {
          color: 'text-gray-600',
          icon: DollarSign,
          prefix: ''
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">Mes Paiements</h2>
          <p className="text-gray-600">Historique complet de tous vos paiements et réceptions</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:flex-shrink-0">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total payé</p>
              <p className="text-base font-bold text-red-600">-185 000 FCFA</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total reçu</p>
              <p className="text-base font-bold text-green-600">+155 000 FCFA</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">En attente</p>
              <p className="text-base font-bold text-yellow-600">25 000 FCFA</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Ce mois</p>
              <p className="text-base font-bold text-blue-600">12 transactions</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        {/* Search Bar - Full width on mobile */}
        <div className="relative bg-white">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par référence, tontine ou bénéficiaire..."
            className="pl-10 h-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col xs:flex-row gap-2">
          <div className="flex flex-1 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 xs:flex-none xs:min-w-[120px] justify-start h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="truncate">Statut</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuCheckboxItem checked>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Payé
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                  Reçu
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                  En attente
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  Échoué
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 xs:flex-none xs:min-w-[120px] justify-start h-10">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="truncate">Type</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuCheckboxItem checked>
                  <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                  Contribution
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  Gain
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>

        {/* Selected Filters with Reset Button */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white border-green-500 text-xs">
            <CheckCircle className="w-3 h-3" />
            Payé
            <X className="w-3 h-3 ml-1 cursor-pointer hover:text-green-200" />
          </Badge>
          <Badge className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white border-red-500 text-xs">
            <TrendingDown className="w-3 h-3" />
            Contribution
            <X className="w-3 h-3 ml-1 cursor-pointer hover:text-red-200" />
          </Badge>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-500 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-2">
        {payments.map((payment) => {
          const statusConfig = getStatusConfig(payment.status);
          const typeConfig = getTypeConfig(payment.type);
          const StatusIcon = statusConfig.icon;
          const TypeIcon = typeConfig.icon;

          return (
            <div key={payment.id} className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{payment.tontine}</h3>
                      <Badge variant="secondary" className={`${statusConfig.color} text-xs px-2 py-0.5`}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{payment.description}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(payment.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {payment.method}
                      </span>
                      <span className="text-xs text-gray-400">{payment.reference}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end sm:space-x-3 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <div className={`flex items-center font-bold text-base ${typeConfig.color}`}>
                      <TypeIcon className="w-3 h-3 mr-1" />
                      <span>{typeConfig.prefix}{payment.amount}</span>
                    </div>
                    <Badge variant="outline" className="mt-0.5 text-xs px-1.5 py-0.5">
                      {payment.type}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-6">
        <Button variant="outline" size="lg">
          Charger plus de transactions
        </Button>
      </div>
    </div>
  );
}