"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  LogOut,
  BadgeCheck,
  Shield
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface NavbarDashboardProps {
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  userVerification?: {
    isEmailVerified: boolean;
    isDocumentVerified: boolean;
  };
}

export default function NavbarDashboard({
  userAvatar = "/avatars/avatar-portrait-svgrepo-com.svg",
  userName = "Jean Dupont",
  userEmail = "jean.dupont@email.com",
  userRole = "USER",
  userVerification = {
    isEmailVerified: true,
    isDocumentVerified: true
  }
}: NavbarDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      // Nettoyer le localStorage pour supprimer les données de l'ancien utilisateur
      localStorage.removeItem('user-store');

      toast.success("Déconnexion réussie");

      // Rediriger vers login
      router.push("/login");

      // Recharger la page pour s'assurer que tout est bien nettoyé
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const isAdmin = userRole === "ADMIN" || userRole === "MODERATOR";

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/images/logo-text2.png"
              alt="Logo Tontine"
              className="w-25 h-12 sm:w-28 sm:h-16 object-contain"
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
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    {userVerification.isEmailVerified && userVerification.isDocumentVerified && (
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-1">
                    {isAdmin && (
                      <>
                        <Link href="/admin">
                          <Button
                            variant="ghost"
                            className="w-full justify-start px-2 py-1.5 h-auto text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Administration</span>
                          </Button>
                        </Link>
                        <hr className="my-2" />
                      </>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 h-auto cursor-pointer"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 h-auto cursor-pointer"
                      onClick={handleLogout}
                    >
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