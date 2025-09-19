import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorAlertProps {
  title?: string
  message: string
  onDismiss?: () => void
  variant?: "error" | "warning" | "info"
}

export function ErrorAlert({
  title = "Erreur",
  message,
  onDismiss,
  variant = "error"
}: ErrorAlertProps) {
  const variants = {
    error: {
      container: "bg-red-50 border-red-300 text-red-700",
      icon: "text-red-600",
      title: "text-red-800"
    },
    warning: {
      container: "bg-orange-50 border-orange-300 text-orange-700",
      icon: "text-orange-600",
      title: "text-orange-800"
    },
    info: {
      container: "bg-blue-50 border-blue-300 text-blue-700",
      icon: "text-blue-600",
      title: "text-blue-800"
    }
  }

  const styles = variants[variant]

  return (
    <div className={`p-4 text-sm border rounded-lg flex items-start gap-3 ${styles.container}`}>
      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
      <div className="flex-1">
        <div className={`font-medium mb-1 ${styles.title}`}>{title}</div>
        <div>{message}</div>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-transparent"
          onClick={onDismiss}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}