"use client"
import { motion } from "framer-motion"
import Navbar from "@/components/shared/Navbar"

const FloatingCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15,
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

export default function Contact() {
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
      </div>

      <Navbar currentPage="contact" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-6 sm:py-8 lg:py-12 relative z-10">

        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-full text-xs sm:text-sm font-medium text-blue-800 border border-blue-200 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Contactez-nous
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Nous sommes là pour{" "}
            <span className="text-blue-600">
              vous accompagner
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Une équipe dédiée à votre service pour répondre à toutes vos questions
            sur l'épargne collaborative et vous accompagner dans vos projets.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left Section - Platform & Manager Info */}
          <div className="space-y-6">

            {/* About Platform */}
            <FloatingCard delay={0.1}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5.5v.5a2 2 0 002 2h.5m-5 0v-8a1 1 0 011-1h1a1 1 0 011 1v8M8 21l4-4 4 4M3 5l18 0" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Notre Plateforme</h2>
                    <p className="text-sm text-blue-600 font-medium">Tontine - Épargne collaborative</p>
                  </div>
                </div>

                <div className="text-gray-600 leading-relaxed space-y-3">
                  <p className="text-sm">
                    <span className="font-semibold text-blue-600">Tontine</span> est la première plateforme digitale
                    d'épargne collaborative au Bénin. Solution moderne, sécurisée et transparente pour
                    démocratiser l'accès à l'épargne collective.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
                      <div className="text-lg font-bold text-green-700">10,000+</div>
                      <div className="text-xs text-green-600 font-medium">Utilisateurs actifs</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
                      <div className="text-lg font-bold text-blue-700">500+</div>
                      <div className="text-xs text-blue-600 font-medium">Tontines créées</div>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>

          </div>

          {/* Right Section - Contact Info */}
          <div className="space-y-6">

            {/* Contact Methods */}
            <div className="space-y-3">

              {/* Email Contact */}
              <FloatingCard delay={0.3}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Email Professionnel</h3>
                    <a
                      href="mailto:contact@tontine.ci"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm text-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8" />
                      </svg>
                      <span>contact@tontine.ci</span>
                    </a>
                  </div>
                </div>
              </FloatingCard>

              {/* Phone Contact */}
              <FloatingCard delay={0.5}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Support Téléphonique</h3>
                    <a
                      href="tel:+2250707123456"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm text-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+225 07 07 12 34 56</span>
                    </a>
                  </div>
                </div>
              </FloatingCard>

              {/* WhatsApp Contact */}
              <FloatingCard delay={0.7}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">WhatsApp Business</h3>
                    <a
                      href="https://wa.me/2250707123456?text=Bonjour,%20j'aimerais%20en%20savoir%20plus%20sur%20la%20plateforme%20Tontine"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm text-sm"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                      </svg>
                      <span>Discuter maintenant</span>
                    </a>
                  </div>
                </div>
              </FloatingCard>
            </div>

          </div>
        </div>
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
              <p className="text-xs sm:text-sm text-gray-600">Support dédié 24/7</p>
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