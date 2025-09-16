"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/shared/Navbar";
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle, Mail, Phone } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar currentPage="home" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Politique de Confidentialité
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl sm:max-w-2xl mx-auto px-2">
            Chez Tontine, nous nous engageons à protéger votre vie privée et vos données personnelles.
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-6 sm:mb-8 mx-2 sm:mx-0">
          <CardContent className="p-4 sm:p-6">
            <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Navigation rapide :</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              <a href="#collecte" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm p-1 rounded hover:bg-blue-50 transition-colors">1. Collecte des données</a>
              <a href="#utilisation" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm p-1 rounded hover:bg-blue-50 transition-colors">2. Utilisation des données</a>
              <a href="#partage" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm p-1 rounded hover:bg-blue-50 transition-colors">3. Partage des données</a>
              <a href="#securite" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm p-1 rounded hover:bg-blue-50 transition-colors">4. Sécurité</a>
              <a href="#droits" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm p-1 rounded hover:bg-blue-50 transition-colors">5. Vos droits</a>
              <a href="#contact" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm p-1 rounded hover:bg-blue-50 transition-colors">6. Contact</a>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 sm:space-y-8 mx-2 sm:mx-0">
          {/* Section 1: Collecte des données */}
          <Card id="collecte">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                1. Données que nous collectons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Données d'identification :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Nom, prénoms</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Date de naissance</li>
                  <li>Adresse postale</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Données de vérification :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Pièces d'identité (CNI, passeport)</li>
                  <li>Justificatifs de domicile</li>
                  <li>Photos de profil</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Données financières :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Informations de paiement (Mobile Money, cartes bancaires)</li>
                  <li>Historique des transactions</li>
                  <li>Montants des cotisations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Données techniques :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Adresses IP</li>
                  <li>Données de navigation (cookies)</li>
                  <li>Informations sur l'appareil utilisé</li>
                  <li>Logs de connexion</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Utilisation des données */}
          <Card id="utilisation">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 flex-shrink-0" />
                2. Comment nous utilisons vos données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Pour le fonctionnement du service :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Création et gestion de votre compte</li>
                  <li>Traitement des paiements et transactions</li>
                  <li>Gestion des tontines et des tours</li>
                  <li>Communication avec les autres participants</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Pour la sécurité :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Vérification d'identité (KYC)</li>
                  <li>Détection de fraude</li>
                  <li>Prévention du blanchiment d'argent</li>
                  <li>Sécurisation des transactions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Pour l'amélioration du service :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Analyse d'utilisation</li>
                  <li>Développement de nouvelles fonctionnalités</li>
                  <li>Support client</li>
                  <li>Notifications importantes</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Partage des données */}
          <Card id="partage">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600 flex-shrink-0" />
                3. Partage de vos données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <p className="text-gray-700 text-xs sm:text-sm">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
              </p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Avec votre consentement :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Partage d'informations avec les autres participants de vos tontines</li>
                  <li>Invitations envoyées par vos soins</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Pour le service :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Prestataires de paiement (Mobile Money, banques)</li>
                  <li>Services d'hébergement sécurisés</li>
                  <li>Services de vérification d'identité</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Obligations légales :</h3>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                  <li>Autorités judiciaires sur ordonnance</li>
                  <li>Organismes de réglementation financière</li>
                  <li>Lutte contre la fraude et le blanchiment</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Sécurité */}
          <Card id="securite">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600 flex-shrink-0" />
                4. Sécurité de vos données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <p className="text-gray-700 text-xs sm:text-sm">
                Nous mettons en place des mesures de sécurité robustes pour protéger vos données :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Chiffrement</h4>
                  <p className="text-xs sm:text-sm text-blue-800">
                    Toutes les données sont chiffrées en transit (TLS) et au repos (AES-256)
                  </p>
                </div>

                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Authentification</h4>
                  <p className="text-xs sm:text-sm text-green-800">
                    Authentification à deux facteurs (2FA) disponible
                  </p>
                </div>

                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Accès contrôlé</h4>
                  <p className="text-xs sm:text-sm text-purple-800">
                    Accès limité aux données sur base du strict nécessaire
                  </p>
                </div>

                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Surveillance</h4>
                  <p className="text-xs sm:text-sm text-orange-800">
                    Monitoring 24/7 et détection d'intrusion
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Vos droits */}
          <Card id="droits">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600 flex-shrink-0" />
                5. Vos droits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <p className="text-gray-700 text-xs sm:text-sm">
                Conformément aux réglementations sur la protection des données, vous disposez des droits suivants :
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Droit d'accès</h4>
                    <p className="text-xs sm:text-sm text-gray-700">Consulter toutes les données que nous détenons sur vous</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Droit de rectification</h4>
                    <p className="text-xs sm:text-sm text-gray-700">Corriger des données inexactes ou incomplètes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Droit à l'effacement</h4>
                    <p className="text-xs sm:text-sm text-gray-700">Demander la suppression de vos données (sous conditions)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Droit à la portabilité</h4>
                    <p className="text-xs sm:text-sm text-gray-700">Recevoir vos données dans un format structuré</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Droit d'opposition</h4>
                    <p className="text-xs sm:text-sm text-gray-700">Vous opposer au traitement de vos données (sous conditions)</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mt-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">Important</h4>
                    <p className="text-xs sm:text-sm text-yellow-700">
                      Certaines données peuvent être conservées pour des obligations légales ou la sécurité du service.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Contact */}
          <Card id="contact">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                6. Nous contacter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <p className="text-gray-700 text-xs sm:text-sm">
                Pour toute question concernant cette politique ou pour exercer vos droits, contactez-nous :
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">Email</span>
                  </div>
                  <p className="text-gray-700">privacy@tontine.app</p>
                  <p className="text-gray-700">dpo@tontine.app</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">Téléphone</span>
                  </div>
                  <p className="text-gray-700">+229 XX XX XX XX</p>
                  <p className="text-sm text-gray-600">Lun-Ven, 8h-18h</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Délégué à la Protection des Données</h4>
                <p className="text-xs sm:text-sm text-blue-800">
                  Notre DPO est disponible pour répondre à toutes vos questions sur la protection de vos données personnelles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="text-center py-6 sm:py-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-gray-600 text-xs sm:text-sm px-4">
                Cette politique peut être mise à jour. Nous vous informerons des changements importants.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Télécharger en PDF
                </Button>
                <Button size="sm" className="text-xs sm:text-sm">
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}