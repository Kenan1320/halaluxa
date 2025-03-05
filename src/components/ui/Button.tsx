
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, href, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-haluna-primary text-white hover:bg-haluna-primary-dark shadow-sm",
      secondary: "bg-haluna-secondary text-haluna-text hover:bg-haluna-beige shadow-sm",
      outline: "border border-haluna-primary text-haluna-primary hover:bg-haluna-primary-light",
      ghost: "text-haluna-primary hover:bg-haluna-primary-light",
      link: "text-haluna-primary underline-offset-4 hover:underline"
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-12 px-8 text-lg"
    };
    
    const buttonClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );
    
    if (href) {
      return (
        <Link
          to={href}
          className={buttonClassName}
        >
          {children}
        </Link>
      );
    }
    
    return (
      <button
        className={buttonClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
