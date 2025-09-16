"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Bell,
  Settings,
  LogOut,
  User,
  CreditCard,
  BadgeCheck
} from "lucide-react";

interface NavbarDashboardProps {
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
  userVerification?: {
    isEmailVerified: boolean;
    isDocumentVerified: boolean;
  };
}

export default function NavbarDashboard({
  userAvatar = "/avatars/avatar-portrait-svgrepo-com.svg",
  userName = "Jean Dupont",
  userEmail = "jean.dupont@email.com",
  userVerification = {
    isEmailVerified: true,
    isDocumentVerified: true
  }
}: NavbarDashboardProps) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/images/logo.png"
              alt="Logo Tontine"
              className="w-16 h-12 sm:w-23 sm:h-16 object-contain"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all shadow-sm">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <img
                        src={userAvatar}
                        alt="Avatar utilisateur"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Jean Dupont
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    jean@example.com
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 h-auto"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 h-auto"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Paiements</span>
                    </Button>
                    <hr className="my-2" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 h-auto"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Button>
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
  );
}