
import { useTheme } from "@/context/ThemeContext"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-[#1E1E1E] dark:group-[.toaster]:text-[#E4F5F0] dark:group-[.toaster]:border-[#2A2A2A]/20",
          description: "group-[.toast]:text-muted-foreground dark:group-[.toast]:text-[#A0A0A0]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground dark:group-[.toast]:bg-[#29866B]",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground dark:group-[.toast]:bg-[#1D2626]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
