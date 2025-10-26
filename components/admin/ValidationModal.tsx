"use client"

import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  X,
  CheckCircle,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import { toast } from "sonner"
import type { PendingValidation } from "@/lib/hooks/useAdmin"

interface ValidationModalProps {
  user: PendingValidation
  onReview: (verificationId: string, action: 'approve' | 'reject', message?: string) => Promise<void>
  isLoading: boolean
}

export function ValidationModal({ user, onReview, isLoading }: ValidationModalProps) {
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)

  const handleApproveClick = () => {
    if (!user.identityVerification) {
      toast.error("Aucune vérification à approuver")
      return
    }
    setShowApproveConfirm(true)
  }

  const handleRejectClick = () => {
    if (!user.identityVerification) {
      toast.error("Aucune vérification à rejeter")
      return
    }

    if (!message.trim()) {
      toast.error("Veuillez indiquer la raison du rejet")
      return
    }
    setShowRejectConfirm(true)
  }

  const confirmApprove = async () => {
    try {
      await onReview(user.identityVerification!.id, 'approve', message)
      toast.success(`Vérification de ${user.name} approuvée !`)
      setShowApproveConfirm(false)
      setOpen(false)
      setMessage("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'approbation")
      setShowApproveConfirm(false)
    }
  }

  const confirmReject = async () => {
    try {
      await onReview(user.identityVerification!.id, 'reject', message)
      toast.success(`Vérification de ${user.name} rejetée`)
      setShowRejectConfirm(false)
      setOpen(false)
      setMessage("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du rejet")
      setShowRejectConfirm(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            Voir
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Validation - {user.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* User info compact */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <Badge variant="outline" className={`text-xs ${
                    user.emailStatus === 'verified' ? 'text-green-700 border-green-200 bg-green-50' : 'text-yellow-700 border-yellow-200 bg-yellow-50'
                  }`}>
                    {user.emailStatus === 'verified' ? 'Vérifié' : 'En attente'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                    <Mail className="w-2.5 h-2.5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-700">{user.email}</span>
                </div>

                {user.telephone && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                      <Phone className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-700">{user.telephone}</span>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
                      <MapPin className="w-2.5 h-2.5 text-orange-600" />
                    </div>
                    <span className="text-xs text-gray-700">{user.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations de vérification */}
            {user.identityVerification && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Informations d'identité</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">Prénom:</span>
                      <p className="font-medium">{user.identityVerification.firstName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nom:</span>
                      <p className="font-medium">{user.identityVerification.lastName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type de document:</span>
                      <p className="font-medium">{user.identityVerification.documentType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Soumis le:</span>
                      <p className="font-medium">
                        {user.identityVerification.submittedAt
                          ? new Date(user.identityVerification.submittedAt).toLocaleDateString('fr-FR')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-900">Documents</h4>
                <div className={`grid gap-2 ${user.identityVerification.documentBackUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div className="border rounded p-2">
                    <p className="text-xs font-medium mb-1">Recto</p>
                    {user.identityVerification.documentFrontUrl ? (
                      <img
                        src={user.identityVerification.documentFrontUrl}
                        alt="Recto du document"
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => window.open(user.identityVerification?.documentFrontUrl || '', '_blank')}
                      />
                    ) : (
                      <div className="bg-gray-100 rounded h-24 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  {user.identityVerification.documentBackUrl && (
                    <div className="border rounded p-2">
                      <p className="text-xs font-medium mb-1">Verso</p>
                      <img
                        src={user.identityVerification.documentBackUrl}
                        alt="Verso du document"
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => window.open(user.identityVerification?.documentBackUrl || '', '_blank')}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {!user.identityVerification && (
              <div className="text-center py-4 text-gray-500 text-sm">
                Aucun document soumis
              </div>
            )}

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-900">
                Message {!message.trim() && <span className="text-red-500">(requis pour rejet)</span>}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                rows={2}
                placeholder="Message pour l'utilisateur..."
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Annuler
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRejectClick}
              disabled={isLoading || !user.identityVerification}
            >
              <X className="w-3 h-3 mr-1" />
              {isLoading ? "..." : "Rejeter"}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              size="sm"
              onClick={handleApproveClick}
              disabled={isLoading || !user.identityVerification}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              {isLoading ? "..." : "Valider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog pour confirmation d'approbation */}
      <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'approbation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir approuver la vérification d'identité de <span className="font-semibold">{user.name}</span> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "En cours..." : "Confirmer l'approbation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog pour confirmation de rejet */}
      <AlertDialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le rejet</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir rejeter la vérification d'identité de <span className="font-semibold">{user.name}</span> ?
              <br /><br />
              <span className="text-sm">Raison du rejet : <span className="font-medium">{message}</span></span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "En cours..." : "Confirmer le rejet"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
