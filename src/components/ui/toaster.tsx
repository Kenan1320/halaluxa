
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  // Filter out unwanted toasts (optional)
  const filteredToasts = toasts.filter(toast => {
    // Filter logic - you can add conditions here to hide specific toasts
    // For example, to hide location-related toasts:
    if (toast.title === "Location enabled" || 
        toast.title === "Location access denied" ||
        toast.title === "Location timeout" ||
        toast.title === "Location error") {
      return false;
    }
    return true;
  });

  return (
    <ToastProvider>
      {filteredToasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
