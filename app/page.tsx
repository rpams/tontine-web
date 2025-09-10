export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 lg:px-20 py-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <img src="/images/logo.png" alt="Tontine" className="h-5 w-auto" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tontine</span>
        </div>
        <div className="flex items-center space-x-3">
          <a 
            href="/login" 
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
          >
            Connexion
          </a>
          <a 
            href="/register" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md text-sm"
          >
            Inscription
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left Section with subtle pattern */}
        <div className="bg-gradient-to-br from-gray-50 to-white relative overflow-hidden px-6 sm:px-8 lg:px-20 py-8 lg:py-12 flex items-center" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%), radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px, 80px 80px, 20px 20px'}}>
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-xl">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-sm font-medium text-blue-800 border border-blue-100/50">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Plateforme 100% sécurisée
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight font-poppins">
                  Épargner ensemble,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                    gagner à chaque tour
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  Rejoignez des milliers d'utilisateurs qui transforment leur épargne avec nos tontines digitales. Simple, sécurisé et rentable.
                </p>
              </div>

              {/* Enhanced Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-lg">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2.5M+</div>
                    <div className="text-sm text-gray-600 font-medium">FCFA épargnés</div>
                    <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">1,200+</div>
                    <div className="text-sm text-gray-600 font-medium">Utilisateurs</div>
                    <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600 font-medium">Tontines</div>
                    <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mt-2"></div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">100% Sécurisé</h3>
                  <p className="text-xs text-gray-600">Transactions protégées</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Instantané</h3>
                  <p className="text-xs text-gray-600">Paiements rapides</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Collaboratif</h3>
                  <p className="text-xs text-gray-600">Gestion de groupe</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Analytics</h3>
                  <p className="text-xs text-gray-600">Suivi détaillé</p>
                </div>
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-base hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-center relative overflow-hidden group"
                >
                  <span className="relative z-10">Commencer maintenant</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </a>
                <a 
                  href="/tontines"
                  className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all text-center"
                >
                  Découvrir les tontines
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section with enhanced gradient */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden px-6 sm:px-8 lg:px-20 py-8 lg:py-12 flex items-center justify-center">
          {/* Enhanced decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 right-16 w-4 h-4 bg-white/20 rounded transform rotate-45 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-32 right-32 w-3 h-3 bg-blue-300/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-24 left-16 w-5 h-5 bg-purple-300/20 rounded transform rotate-12 animate-bounce" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="relative z-10 w-full max-w-md">
            {/* Enhanced Dashboard Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
              {/* Card background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-lg">Dashboard Tontines</h3>
                    <p className="text-white/70 text-sm">3 tontines actives</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              
                {/* Enhanced Tontine Items */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl border border-emerald-400/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">Tontine Famille</div>
                        <div className="text-white/70 text-xs">12 participants</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-300 text-sm">85K FCFA</div>
                      <div className="text-emerald-400 text-xs font-medium">Votre tour</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">Épargne Projet</div>
                        <div className="text-white/70 text-xs">8 participants</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-300 text-sm">50K FCFA</div>
                      <div className="text-white/70 text-xs">Dans 2 jours</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">Business Fund</div>
                        <div className="text-white/70 text-xs">6 participants</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-300 text-sm">25K FCFA</div>
                      <div className="text-white/70 text-xs">Dans 1 sem.</div>
                    </div>
                  </div>
                </div>
              
                {/* Enhanced Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-bold text-sm hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl">
                    Faire un paiement
                  </button>
                  <button className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white hover:bg-white/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 rounded-2xl shadow-2xl animate-bounce border border-emerald-400">
              <div className="flex items-center space-x-2 text-sm font-bold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                </svg>
                <span>+85K FCFA</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-xl text-white p-3 rounded-2xl shadow-2xl border border-white/30">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t px-6 lg:px-20 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 font-medium">Paiements sécurisés avec nos partenaires</p>
          </div>
          <div className="flex items-center space-x-6 opacity-70 hover:opacity-100 transition-opacity">
            <img src="/images/mtn.png" alt="MTN" className="h-6 w-auto grayscale hover:grayscale-0 transition-all hover:scale-110" />
            <img src="/images/moovmoney.png" alt="Moov" className="h-6 w-auto grayscale hover:grayscale-0 transition-all hover:scale-110" />
            <img src="/images/visa.svg" alt="Visa" className="h-6 w-auto grayscale hover:grayscale-0 transition-all hover:scale-110" />
            <img src="/images/mastercard.svg" alt="MC" className="h-6 w-auto grayscale hover:grayscale-0 transition-all hover:scale-110" />
          </div>
        </div>
      </footer>
    </div>
  );
}