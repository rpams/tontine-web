"use client";

import Link from "next/link";

interface NavbarProps {
  currentPage?: "home" | "contact";
}

export default function Navbar({ currentPage = "home" }: NavbarProps) {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <Link href="/">
                <img
                  src="/images/logo.png"
                  alt="Logo Tontine"
                  className="h-6 sm:h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Tontine
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Épargne collaborative
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentPage === "contact" ? (
              <>
                <a
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm sm:text-base"
                >
                  Accueil
                </a>
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Connexion
                </a>
              </>
            ) : (
              <>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm sm:text-base"
                >
                  Contact
                </a>
                <a
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm sm:text-base"
                >
                  Connexion
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Inscription
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
