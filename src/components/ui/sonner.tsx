
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { ReactNode } from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  // Function to filter location-related toasts
  const filterToast = (toast: any) => {
    // We need to check if toast properties are defined
    if (!toast) return false;
    
    // Convert toast title and description to lowercase strings if they're strings
    const titleString = typeof toast.title === 'string' ? toast.title.toLowerCase() : '';
    const descriptionString = typeof toast.description === 'string' ? toast.description.toLowerCase() : '';
    
    // Hide location-related toasts
    if (titleString.includes('location') || descriptionString.includes('location')) {
      return false;
    }
    return true;
  };

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      // Set to false to prevent toasts from appearing automatically
      richColors
      position="top-right"
      expand={false}
      // Disable all toasts by setting duration very low
      duration={1}
      // We need to modify the sonner package to support filter
      {...props}
    />
  )
}

export { Toaster }
