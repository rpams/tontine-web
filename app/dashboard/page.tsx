"use client";

import { useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarChart3,
  Users,
  CreditCard,
  User,
  BadgeCheck
} from "lucide-react";
import Overview from "@/components/dashboard/Overview";
import Profile from "@/components/dashboard/Profile";
import Tontines from "@/components/dashboard/Tontines";
import Payments from "@/components/dashboard/Payments";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";
import { Separator } from "@radix-ui/react-separator";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userAvatar, setUserAvatar] = useState("/avatars/avatar-portrait-svgrepo-com.svg");
  const [userVerification, setUserVerification] = useState({
    isEmailVerified: true,
    isDocumentVerified: true
  });

  return (
    <div className="min-h-screen bg-stone-100/90" style={{backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
      <NavbarDashboard
        userAvatar={userAvatar}
        userName="Jean Dupont"
        userEmail="jean.dupont@email.com"
        userVerification={userVerification}
      />


      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-12 py-4 md:py-8">
        {/* User Info Block */}
        <div className="bg-white border p-3 rounded-lg mb-4 max-w-full sm:max-w-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-green-500 bg-green-50 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <img 
                  src={userAvatar} 
                  alt="Jean Dupont"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-medium text-gray-900 font-poppins truncate text-sm">Jean Dupont</h3>
                {userVerification.isEmailVerified && userVerification.isDocumentVerified && (
                  <BadgeCheck className="w-3 h-3 text-blue-600 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-gray-400 mr-1">@</span>
                <span className="truncate">jean.dupont@email.com</span>
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
                Aperçu
              </Button>
              <Button
                variant={activeTab === "tontines" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("tontines")}
                className="flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
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
                variant={activeTab === "profile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("profile")}
                className="flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Profil
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                12hrs temps économisé
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                ✓ 24 tontines terminées
              </Badge>
              <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                ⏳ 7 tontines en cours
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
                <BreadcrumbPage>Tableau de bord</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>



        {/* Tab Content */}
        {activeTab === "overview" && <Overview />}
        {activeTab === "profile" && <Profile onAvatarChange={setUserAvatar} currentAvatar={userAvatar} />}
        {activeTab === "tontines" && <Tontines />}
        {activeTab === "payments" && <Payments />}
      </main>
    </div>
  );
}