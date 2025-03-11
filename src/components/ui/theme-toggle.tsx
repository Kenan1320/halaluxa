
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, toggleMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMode}
      className={cn(
        "rounded-full w-9 h-9 transition-colors",
        mode === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-gray-100 hover:bg-gray-200',
        className
      )}
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? (
        <Sun className="h-5 w-5 text-white" />
      ) : (
        <Moon className="h-5 w-5 text-gray-800" />
      )}
    </Button>
  );
}
