
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

  // Filter out unwanted toasts - specifically location-related ones
  const filteredToasts = toasts.filter(toast => {
    // Safely check if title or description includes location (handling non-string values)
    const titleString = typeof toast.title === 'string' ? toast.title.toLowerCase() : '';
    const descriptionString = typeof toast.description === 'string' ? toast.description.toLowerCase() : '';
    
    if (titleString.includes('location') || descriptionString.includes('location')) {
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
