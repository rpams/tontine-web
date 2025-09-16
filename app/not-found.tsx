"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, HelpCircle, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 opacity-30"
             style={{
               backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
               backgroundSize: '30px 30px',
               backgroundPosition: '0 0, 15px 15px'
             }}>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-16 h-16 bg-purple-200/30 rotate-45"
          animate={{
            y: [0, -8, 0],
            x: [0, 5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <img
                src="/images/logo.png"
                alt="Logo Tontine"
                className="h-6 sm:h-8 w-auto"
              />
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Tontine
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Épargne collaborative
                </p>
              </div>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="text-center">
          {/* 404 Animation - Plus prominent sur mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-10"
          >
            <div className="relative inline-block">
              <motion.h1
                className="text-8xl sm:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-none"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                404
              </motion.h1>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-2xl -z-10 scale-110"></div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Page introuvable
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-xs sm:max-w-md mx-auto px-2">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </motion.div>

          {/* Actions principales - Design restructuré */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 sm:mb-10"
          >
            {/* Action principale */}
            <div className="mb-6">
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Home className="w-5 h-5 mr-2" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>

            {/* Actions secondaires */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:gap-4 max-w-md mx-auto px-4">
              <Link href="/dashboard" className="block sm:flex-1">
                <Card className="hover:shadow-md transition-all duration-300 hover:scale-[1.02] border-2 hover:border-blue-200">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Mon Dashboard</h3>
                        <p className="text-xs text-gray-600">Gérer mes tontines</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/tontines" className="block sm:flex-1">
                <Card className="hover:shadow-md transition-all duration-300 hover:scale-[1.02] border-2 hover:border-green-200">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tontines</h3>
                        <p className="text-xs text-gray-600">Rejoindre une tontine</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Support */}
            <div className="mt-6 text-center">
              <Link href="/contact">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 text-sm">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Besoin d'aide ?
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Navigation secondaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la page précédente
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Paiements sécurisés</p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img src="/images/mtn.png" alt="MTN" className="h-4 sm:h-5 w-auto opacity-60 hover:opacity-100 transition-opacity" />
              <img src="/images/moovmoney.png" alt="Moov" className="h-4 sm:h-5 w-auto opacity-60 hover:opacity-100 transition-opacity" />
              <img src="/images/visa.svg" alt="Visa" className="h-4 sm:h-5 w-auto opacity-60 hover:opacity-100 transition-opacity" />
              <img src="/images/mastercard.svg" alt="MC" className="h-4 sm:h-5 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}