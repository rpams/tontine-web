"use client"
import { motion } from "framer-motion"
import Navbar from "@/components/shared/Navbar"

const FloatingCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: [1, 1.02, 1]
      }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15,
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 1
        }
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.3, type: "spring" },
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dotted Pattern - Top Section */}
        <div className="absolute top-0 left-0 w-full h-1/2 opacity-30" 
             style={{
               backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
               backgroundSize: '30px 30px',
               backgroundPosition: '0 0, 15px 15px'
             }}>
        </div>
        
        {/* Grid Pattern - Bottom Section */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>
      
      {/* Floating Geometric Motifs */}
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
        ></motion.div>
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rotate-45"
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
        ></motion.div>
        <motion.div
          className="absolute top-1/3 left-1/4 w-12 h-12 bg-green-200/30 rounded-full"
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-orange-200/30 rounded-full"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-20 left-1/3 w-18 h-18 bg-pink-200/30 rotate-12"
          animate={{
            y: [0, -8, 0],
            rotate: [12, 20, 12]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        ></motion.div>
        <motion.div
          className="absolute top-1/2 right-10 w-14 h-14 bg-indigo-200/30 rounded-lg rotate-45"
          animate={{
            y: [0, -10, 0],
            x: [0, -5, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        ></motion.div>
      </div>
      
      {/* Header */}
      <Navbar currentPage="home" />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-6 sm:py-8 lg:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-4 sm:space-y-6 relative">
            <div className="space-y-3 sm:space-y-4 relative z-10">
              <div className="inline-flex items-center px-3 py-1.5 bg-green-50 rounded-full text-xs sm:text-sm font-medium text-green-800 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Plateforme sécurisée
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                Révolutionnez votre épargne,{" "}
                <span className="text-blue-600">
                  réalisez vos rêves
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Rejoignez la communauté des épargnants malins. Avec nos tontines digitales sécurisées,
                transformez vos objectifs financiers en succès garantis.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mb-1.5">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">100% Sécurisé</h3>
                <p className="text-xs text-gray-600">Vos fonds protégés</p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mb-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Ultra Rapide</h3>
                <p className="text-xs text-gray-600">Paiements en 1 clic</p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mb-1.5">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Collaboratif</h3>
                <p className="text-xs text-gray-600">Épargne solidaire</p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mb-1.5">
                  <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Suivi Complet</h3>
                <p className="text-xs text-gray-600">Tableaux de bord</p>
              </div>
            </div>
              
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/tontines"
                className="bg-blue-600 text-white px-4 py-3 sm:px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm text-center text-sm sm:text-base"
              >
                Rejoindre une tontine
              </a>
              <a
                href="/dashboard"
                className="bg-white border border-gray-300 text-gray-700 px-4 py-3 sm:px-6 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors text-center text-sm sm:text-base"
              >
                Accéder à mon espace
              </a>
            </div>
          </div>

          {/* Right Section - Dashboard Preview with Featured Woman Image */}
          <div className="lg:pl-4 relative">
            {/* Featured Success Woman Image - Desktop floating, mobile organized */}
            <div className="lg:absolute lg:-top-28 lg:-right-20 lg:w-72 lg:h-96 lg:z-20 flex justify-center lg:block mb-6 lg:mb-0">
              <div className="relative w-48 h-64 sm:w-56 sm:h-72 lg:w-full lg:h-full">
                <img
                  src="/images/woman.png"
                  alt="Femme réussie avec téléphone"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
                {/* Highlight the white outline */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-3xl -z-10 blur-xl"></div>
              </div>
            </div>

            {/* Floating Cards - Desktop floating, mobile organized */}
            <div className="lg:hidden flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
              <FloatingCard
                className="border-2 border-green-300 max-w-xs mx-auto sm:mx-0 -mt-6 sm:mt-0"
                delay={1}
              >
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-1 rounded-full shadow-sm ring-2 ring-green-300/20">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">Paiement reçu</p>
                    <p className="text-xs text-green-600 font-medium">
                      +25,000 FCFA
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard
                className="border-2 border-blue-200/50 max-w-xs mx-auto sm:mx-0"
                delay={1.5}
              >
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-1.5 sm:p-2 rounded-full shadow-sm ring-2 ring-blue-300/20">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">Tour terminé</p>
                    <p className="text-xs text-blue-600 font-medium">
                      Objectif atteint
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </FloatingCard>
            </div>

            {/* Floating Payment Card - Desktop only */}
            <FloatingCard
              className="absolute -bottom-15 -right-10 z-30 lg:block hidden border-2 border-green-300"
              delay={1}
            >
              <div className="flex items-center gap-3 px-2">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-1 rounded-full shadow-sm ring-2 ring-green-300/20">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">Paiement reçu</p>
                  <p className="text-xs text-green-600 font-medium">
                    +25,000 FCFA
                  </p>
                </div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </FloatingCard>

            {/* Dashboard */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 py-3 sm:py-4 max-w-sm mx-auto lg:-mt-10 relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">Mes Tontines</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">3 tontines actives</p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Tontine Famille</div>
                      <div className="text-gray-600 text-xs">12 participants</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700 text-sm">85K</div>
                    <div className="text-green-600 text-xs">Votre tour</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Épargne Projet</div>
                      <div className="text-gray-600 text-xs">8 participants</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-700 text-sm">50K</div>
                    <div className="text-gray-600 text-xs">2 jours</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Business Fund</div>
                      <div className="text-gray-600 text-xs">6 participants</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-700 text-sm">25K</div>
                    <div className="text-gray-600 text-xs">1 sem.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Success Card - Desktop only */}
        <FloatingCard
          className="absolute top-28 right-26 xl:right-76 z-30 lg:block hidden border-2 border-blue-200/50"
          delay={1.5}
        >
          <div className="flex items-center gap-3 px-2">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-full shadow-sm ring-2 ring-blue-300/20">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900">Tour terminé</p>
              <p className="text-xs text-blue-600 font-medium">
                Objectif atteint
              </p>
            </div>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </FloatingCard>

      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200 mt-8 sm:mt-12 relative z-10">
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