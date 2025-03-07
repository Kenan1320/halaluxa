
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  mobile?: boolean;
}

export function ThemeToggle({ mobile = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  if (mobile) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg transition cursor-pointer" 
           onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-haluna-primary" />
          ) : (
            <Moon className="h-5 w-5 text-haluna-primary" />
          )}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </div>
      </div>
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 0 : 1,
          opacity: theme === "dark" ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-haluna-primary" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-haluna-primary" />
      </motion.div>
    </Button>
  );
}
